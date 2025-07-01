import { getRemoteString, postData, getData } from '@frontendUtils/load-script';
import type { CdnCoreConfigData, ErrorHandlerType } from './config';
import {
  getCdnConfig,
  getErrorHandler,
  getUrl,
  setCdnConfig,
} from './config';
import { coreLoadScript as loadScript } from './loadScript';


export {
  getCdnConfig,
  setCdnConfig,
  loadScript,
  getUrl,
  getData,
  getErrorHandler,
  getRemoteString,
  postData,
};

export type {
  ErrorHandlerType,
  CdnCoreConfigData,
};

