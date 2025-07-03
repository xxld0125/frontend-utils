import { getRemoteString, postData, getData } from '@frontendUtils/load-script';
import type { CdnCoreConfigData, ErrorHandlerType } from './config';
import {
  getCdnConfig,
  getErrorHandler,
  getUrl,
  setCdnConfig,
} from './config';
import { startCdnCore } from './start';
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
  startCdnCore
};

export type {
  ErrorHandlerType,
  CdnCoreConfigData,
};

