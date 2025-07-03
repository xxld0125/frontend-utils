import { startCdnCore } from '@frontendUtils/cdn-core';

import type { ExtCoreConfigData } from './config';
import { setExtConfig } from './config';

// 全部开始
export function startExtCore(config: ExtCoreConfigData): void {
  // 设置配置
  setExtConfig(config);

  // 启动 cdn
  startCdnCore(config);
}
