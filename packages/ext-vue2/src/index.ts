import { loadScript, getConfig, startCdnComponent } from '@frontendUtils/cdn-vue2';
import { extJs, startExtCore } from '@frontendUtils/ext-core';
import type { ExtCoreConfigData } from '@frontendUtils/ext-core';
import type { CdnComponentConfig } from '@frontendUtils/cdn-vue2';
import ExtComponent from './ExtComponent';

const extApp = (options: ExtCoreConfigData & CdnComponentConfig): void => {
  startExtCore(options);
  startCdnComponent(options);
}

export { extApp, extJs, loadScript, getConfig, ExtComponent };
