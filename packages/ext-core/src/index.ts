import type { ErrorHandlerType } from '@frontendUtils/cdn-core';
import { getErrorHandler } from '@frontendUtils/cdn-core';

import extApi from './api';
import type { CheckerType, Ext } from './api';
import { getExtConfig, setExtConfig } from './config';
import type { ExtCoreConfigData } from './config';
import { extJs } from './extJs';
import type { ExtJsOptions } from './extJs';
import { startExtCore } from './start';

export { startExtCore, extApi, ErrorHandlerType, getErrorHandler, CheckerType, getExtConfig, setExtConfig, extJs };

export type { Ext, ExtCoreConfigData, ExtJsOptions };
