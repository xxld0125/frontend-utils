export type ErrorHandlerType = (error: any) => void;

export interface globalAssetsType {
  js?: string[];
  css?: string[];
}

export interface CdnCoreConfigData {
  baseURL?: string;
  errorHandler?: ErrorHandlerType;
}

let configData: CdnCoreConfigData = {};

// 设置 cdn 配置
export const setCdnConfig = (options: CdnCoreConfigData): void => {
  configData = options;
};

// 获取 cdn 配置
export const getCdnConfig = (): CdnCoreConfigData => configData;

// 获取 url
export const getUrl = (_url: string): string => {
  if (!configData.baseURL || _url.indexOf('http') === 0) return _url;
  const baseURL = configData.baseURL.endsWith('/')
    ? configData.baseURL.slice(0, configData.baseURL.length - 1)
    : configData.baseURL;
  const url = _url[0] === '/' ? _url : `/${_url}`;
  return `${baseURL}${url}`;
};

// 获取错误处理函数
export const getErrorHandler = (errorHandler?: ErrorHandlerType): ErrorHandlerType => {
  if (errorHandler) return errorHandler;
  if (configData.errorHandler) return configData.errorHandler;
  return console.error;
};