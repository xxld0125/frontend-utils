import type { CdnCoreConfigData } from '@frontendUtils/cdn-core';

import type { Ext } from './api';

type PreFetchChecker = (ext: Ext) => boolean;

export type PreFetchType = boolean | string[] | PreFetchChecker;

export interface ExtCoreConfigData extends CdnCoreConfigData {
  // 应用分组
  appGroup?: string;
  // 应用名称
  appName?: string;
}

let configData: ExtCoreConfigData = { appGroup: '', appName: '' };

export const setExtConfig = (options: ExtCoreConfigData): void => {
  configData = options;
};

export const getExtConfig = (): ExtCoreConfigData => configData;
