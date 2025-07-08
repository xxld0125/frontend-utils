import {
  getErrorHandler,
  loadScript,
} from '@frontendUtils/cdn-core';

import CdnComponent from './CdnComponent';
import { getConfig, startCdnComponent } from './config';
import type { CdnComponentConfig } from './config';

export {
  getErrorHandler,
  loadScript,
  startCdnComponent,
  CdnComponent,
  getConfig,
};

export type { CdnComponentConfig };
