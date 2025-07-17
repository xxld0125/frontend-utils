import { debug } from './utils';
import { loadScript } from '@frontendUtils/load-script';
import { getUrl } from './config';

import { version } from '../package.json';


export function systemImport<T = unknown>(path: string, exportName?: string): Promise<T> {
  const url = getUrl(path);

  return loadScript(url).then((mod: any) => {
    debug(`${url} 请求成功，模块内容为：`, mod);

    if (mod?.default?.default) {
      mod.default = mod.default.default;
    }

    let res = mod;

    if (!mod) {
      res = mod;
    } else if (!exportName) {
      res = (typeof mod === 'object' && mod.default) ? mod.default : mod;
    } else {
      res = mod[exportName] ?? mod?.default?.[exportName];
    }

    debug(`${url} 最终返回值为：`, res);

    return res;
  })
}

export function coreLoadScript<T = unknown>(path: string, exportName?: string, emptyError: boolean = true): Promise<T> {
  if (!path) {
    return Promise.reject(new Error(`[cdn-core ${version}]: 加载 script 失败，原因为：路径参数为空`));
  }

  // 从远程获取
  const request = systemImport<T>(path, exportName)
    .catch(() => systemImport<T>(path, exportName))
    .catch(() => new Promise((resolve) => setTimeout(() => resolve(systemImport<T>(path, exportName)), 100)))
    .catch(() => new Promise((resolve) => setTimeout(() => resolve(systemImport<T>(path, exportName)), 200)))
    .then((res: any) => {
      if (res === undefined && emptyError) {
        throw new Error(`[cdn-core ${version}]: 加载 script 失败，路径为 ${path}，原因为：资源未正确导出任何变量`);
      }
      return res;
    }, error => {
      throw new Error(`[cdn-core ${version}]: 加载 script 失败，路径为 ${path}，具体原因为：${error.message}`);
    });

  return request;
}
