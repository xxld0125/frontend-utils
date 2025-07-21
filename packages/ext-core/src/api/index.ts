import { getErrorHandler, getUrl, postData } from '@frontendUtils/cdn-core';

import { version } from '../../package.json';
import { getExtConfig } from '../config';
export interface Ext {
  name: string;
  url: string;
  conditions: Record<string, string>;
}

export type CheckerType = (conditions: Record<string, string>) => boolean;

interface ExtOriginType {
  type: number;
  interface_method: string;
  condition: Record<string, string>;
  extension_point_url: string;
}

class ExtApi {
  private readonly maxRetryCount = 3;
  private hasLoad: boolean = false;
  private extList: Ext[] = [];
  private retryCount: number = 0;
  private request: Promise<{ list: ExtOriginType[] } | undefined> | undefined;

  // 获取扩展点列表
  async getExtList(): Promise<Ext[]> {
    // 全局之请求一次
    if (this.hasLoad) {
      return this.extList;
    }

    // 发起请求
    await this.doRequest();

    return this.extList;
  }

  async doRequest(): Promise<void> {
    this.request ??= this.setRequest();

    const { errorHandler } = getExtConfig();
    const handler = getErrorHandler(errorHandler);

    try {
      const res = await this.request;
      if (!res?.list) {
        throw new Error(`[@frontendUtils/ext-core ${version}]: 获取扩展点列表失败，数据为空`);
      }
      this.setExtList(res.list);
      this.hasLoad = true;
      this.retryCount = 0;
    } catch (error: any) {
      this.request = undefined;
      this.retryCount = this.retryCount + 1;

      // 判断有无达到最大重试次数
      if (this.retryCount < this.maxRetryCount) {
        // 重新发起请求
        this.request = this.setRequest();
        await this.doRequest();
      } else {
        const err = new Error(
          `[@frontendUtils/ext-core ${version}]: 请求扩展点列表接口失败，失败原因 ${error.name} ${error.message}`
        );
        handler(err);
        const cacheList = this.getCache(5);
        if (cacheList) {
          this.setExtList(cacheList);
        } else {
          throw err;
        }
      }
    }
  }

  setExtList(list: ExtOriginType[]): void {
    this.extList = list
      .filter(item => item.type === 2)
      .map(item => ({
        name: item.interface_method,
        url: getUrl(item.extension_point_url),
        conditions: item.condition
      }));
  }

  async setRequest(): Promise<{ list: ExtOriginType[] }> {
    const { appGroup, appName, errorHandler } = getExtConfig();
    const handler = getErrorHandler(errorHandler);

    // 检查 environment
    const environment: any = (window as any)['ENVIRONMENT_EXT'];

    if (!environment) {
      const newError = new Error(`[@frontendUtils/ext-core ${version}]: 未注入扩展点请求地址`);
      console.error(newError);
      handler(newError);
      return Promise.resolve({ list: [] });
    }

    let errorMsg = '';

    // 检查 ares-ext
    if (!environment['ares-ext']) {
      errorMsg = `[@frontendUtils/ext-core ${version}]: 扩展点 url 未配置`;
    }

    // 检查 appGroup 和 appName
    if (!appGroup || !appName) {
      errorMsg = `[@frontendUtils/ext-core ${version}]: 未能成功发起请求，appGroup 当前是 ${appGroup ?? '空'}, appName 当前是 ${appName ?? '空'}，请检查代码确定是否配置这两个参数。`;
    }

    // 如果有错误，则返回空
    if (errorMsg) {
      console.error(errorMsg);
      const errorData = new Error(errorMsg);
      handler(errorData);
      throw errorData;
    }

    // 生产环境1分钟内不重复请求
    const env = (window as any)['ENVIRONMENT_EXT']?.['env'];

    const cacheList = this.getCache(1);

    if (cacheList && env?.includes('prod')) {
      return Promise.resolve({ list: cacheList });
    }

    const url = environment['ares-ext'];

    const headers = {
      'Content-Type': 'application/json',
    };

    return postData<{ list: ExtOriginType[] }>(url, { type: 2 }, headers).then(res => {
      if (!res.list) {
        res.list = [];
      }
      this.setCache(res);
      return res;
    });
  }

  getCacheKey(): string {
    const { appGroup, appName } = getExtConfig();

    return appGroup && appName ? `${appGroup}-${appName}` : '';
  }

  getCache(minute: number): ExtOriginType[] | false {
    // 如果请求失败，则判断缓存是否存在
    if (this.getCacheKey() && localStorage.getItem(this.getCacheKey())) {
      try {
        const res = JSON.parse(localStorage.getItem(this.getCacheKey()) ?? '');

        // 5分钟缓存
        if (Date.now().valueOf() <= res.time + minute * 60 * 1000) {
          return res.list;
        }
      } catch {
        return false;
      }
    }

    return false;
  }

  setCache(res: any): void {
    if (this.getCacheKey() && res.list) {
      localStorage.setItem(
        this.getCacheKey(),
        JSON.stringify({
          time: Date.now().valueOf(),
          list: res.list
        })
      );
    }
  }

  async getExt(name: string, checker: CheckerType): Promise<Ext | undefined> {
    const list = await this.getExtList();
    const ext = list
      .filter(item => item.name === name)
      .find(item => {
        try {
          return checker(item.conditions);
        } catch (e: any) {
          throw new Error(
            `[@frontendUtils/ext-core ${version}]: 执行 checker 函数失败，${e.name} ${e.message}，解决方案：请检查 checker 函数实现是否可能造成语法异常`
          );
        }
      });

    if (!ext) return undefined;
    return ext;
  }

  reset(): void {
    this.hasLoad = false;
    this.extList = [];
    this.retryCount = 0;
    this.request = undefined;
    if (this.getCacheKey()) {
      localStorage.removeItem(this.getCacheKey());
    }
  }
}

export const extApi = new ExtApi();

export default extApi;
