import { startCdnCore } from '@frontendUtils/cdn-core';
import type { CdnCoreConfigData } from '@frontendUtils/cdn-core';

let configObj = {};

export interface CdnComponentConfig extends Partial<CdnCoreConfigData> {
  errorFallback?: string | object;
  loadingFallback?: string | object;
}

export const startCdnComponent = (options: CdnComponentConfig) => {
  configObj = options;
  const { baseURL, errorHandler } = options;
  startCdnCore({
    ...(baseURL !== undefined && { baseURL }),
    ...(errorHandler !== undefined && { errorHandler }),
  });
}

export const getConfig = () => configObj;
