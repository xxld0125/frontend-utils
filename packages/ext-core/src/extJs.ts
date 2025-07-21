import { getErrorHandler, loadScript } from '@frontendUtils/cdn-core';

import { version } from '../package.json';
import extApi from './api';
import type { CheckerType, Ext } from './api';

export interface ExtJsOptions<T = any> {
  // 扩展点名称
  name: string;
  // 检测扩展点
  checker: CheckerType;

  /**
   * 是否在内部或者接口报错的情况下，是阻塞原流程，还是走原逻辑
   * PS: 无论选择那种，错误都会上报到 errorHandler
   *
   * blockOnError: false // 如果内部报错，总是会走原逻辑
   * blockOnError: true // 如果内部报错，总是会阻塞原逻辑，并显示报错
   */
  blockOnError: boolean;

  // 导出内容
  exportName?: string;
  // 错误处理
  errorHandler?: (error: any) => void;
  // 原逻辑
  originFn?: (...args: any[]) => T;
  // 开发环境下直接调试 JS 链接
  devUrl?: string;
}

// 逻辑扩展点实现
export function extJs<T = any>(options: ExtJsOptions<T>): (...fnOptions: any[]) => Promise<any> {
  const { name, checker, devUrl, exportName, blockOnError, originFn } = options;
  const errorHandler = getErrorHandler(options.errorHandler);
  const doOrigin = (option: any[]) => (originFn ? originFn.apply(undefined, option) : Promise.resolve());
  const doOnError = (error: Error, option: any[]) => {
    errorHandler(error); // 上报错误
    if (blockOnError) {
      // 是否需要显示异常
      throw error;
    } else {
      return doOrigin(option); // 正常返回
    }
  };

  // 获取扩展点
  return async (...fnOptions: any[]) => {
    try {
      let ext: Ext | undefined;

      // 开发环境直接使用 devUrl
      if (devUrl && (window as any)['ENVIRONMENT_EXT']?.['env'] === 'dev') {
        ext = {
          name: 'DEV_URL',
          url: devUrl,
          conditions: {}
        };
      } else {
        // 非开发环境通过接口获取扩展点
        ext = await extApi.getExt(name, checker);
      }

      // 如果没有扩展点, 则走原逻辑
      if (!ext) return doOrigin(fnOptions);

      const fn = await loadScript(ext.url, exportName);

      if (typeof fn === 'function') {
        return fn.apply(undefined, fnOptions);
      } else {
        return doOnError(
          new Error(
            `[@frontendUtils/ext-core ${version}]：${typeof fn} ${fn} 不是一个函数，相关信息：${ext.url} 的 ${exportName ?? '默认导出'}，解决方案：请检查链接内容`
          ),
          fnOptions
        );
      }
    } catch (error) {
      return doOnError(error as Error, fnOptions);
    }
  };
}
