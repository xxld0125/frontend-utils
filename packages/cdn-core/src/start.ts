import type { CdnCoreConfigData } from './config';
import { setCdnConfig } from './config';

// 启动 cdn-core
export function startCdnCore(config: CdnCoreConfigData): void {
  setCdnConfig(config);
}
