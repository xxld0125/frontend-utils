import type { CdnCoreConfigData } from '@frontendUtils/cdn-core';

import type { Ext } from './api';

type PreFetchChecker = (ext: Ext) => boolean;

export type PreFetchType = boolean | string[] | PreFetchChecker;

export interface ExtCoreConfigData extends CdnCoreConfigData {
  // 应用分组
  appGroup?: string;
  // 应用名称
  appName?: string;
  // 本地开发环境调用测试环境的扩展点接口
  devUseTestApi?: boolean;
}

let configData: ExtCoreConfigData = { appGroup: '', appName: '' };

export const setExtConfig = (options: ExtCoreConfigData): void => {
  configData = options;
};

export const getExtConfig = (): ExtCoreConfigData => configData;
