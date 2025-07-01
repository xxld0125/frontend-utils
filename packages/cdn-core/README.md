# @frontendUtils/cdn-core

[![npm version](https://badge.fury.io/js/%40frontendUtils%2Fcdn-core.svg)](https://badge.fury.io/js/%40frontendUtils%2Fcdn-core)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

CDN 核心逻辑包，提供动态加载远程脚本资源的能力，支持重试机制和错误处理。

## 特性

- 🚀 **动态加载**：支持动态加载远程 JavaScript 模块
- 🔄 **重试机制**：内置智能重试机制，提高加载成功率
- 🛡️ **错误处理**：完善的错误处理和自定义错误处理器
- 📦 **模块导出**：支持指定模块导出名称
- 🌐 **网络请求**：提供 GET/POST 请求和远程内容获取功能
- 🎯 **TypeScript**：完整的 TypeScript 类型支持
- 🔧 **配置灵活**：支持自定义 baseURL 和错误处理器

## 安装

```bash
# 使用 npm
npm install @frontendUtils/cdn-core

# 使用 yarn
yarn add @frontendUtils/cdn-core

# 使用 pnpm
pnpm add @frontendUtils/cdn-core
```

## 快速开始

### 基础使用

```typescript
import { loadScript, setCdnConfig } from '@frontendUtils/cdn-core';

// 配置 CDN 基础路径
setCdnConfig({
  baseURL: 'https://cdn.example.com',
  errorHandler: (error) => {
    console.error('CDN 加载失败:', error);
  }
});

// 加载远程脚本
const moduleData = await loadScript('path/to/module.js');
console.log(moduleData);
```

### 加载指定导出

```typescript
// 加载模块的特定导出
const specificExport = await loadScript('path/to/module.js', 'exportName');

// 加载默认导出
const defaultExport = await loadScript('path/to/module.js');
```

### 网络请求

```typescript
import { getData, postData, getRemoteString } from '@frontendUtils/cdn-core';

// 获取远程数据
const apiData = await getData('https://api.example.com/users');

// 提交数据
const result = await postData('https://api.example.com/login', {
  username: 'user',
  password: 'pass'
});

// 获取远程脚本内容
const scriptContent = await getRemoteString('https://cdn.example.com/lib.js');
```

## API 文档

### 配置相关

#### `setCdnConfig(options: CdnCoreConfigData): void`

设置 CDN 全局配置。

**参数：**
- `options.baseURL?: string` - CDN 基础路径
- `options.errorHandler?: ErrorHandlerType` - 自定义错误处理器

```typescript
setCdnConfig({
  baseURL: 'https://cdn.example.com',
  errorHandler: (error) => {
    // 自定义错误处理逻辑
    console.error('CDN 错误:', error);
  }
});
```

#### `getCdnConfig(): CdnCoreConfigData`

获取当前 CDN 配置。

```typescript
const config = getCdnConfig();
console.log(config.baseURL); // 'https://cdn.example.com'
```

### 加载功能

#### `loadScript<T>(path: string, exportName?: string, emptyError?: boolean): Promise<T>`

加载远程脚本资源。

**参数：**
- `path: string` - 脚本路径
- `exportName?: string` - 指定导出名称（可选）
- `emptyError?: boolean` - 是否在空结果时抛出错误（默认：true）

**返回值：**
- `Promise<T>` - 返回加载的模块内容

```typescript
// 基础用法
const module = await loadScript('/modules/utils.js');

// 指定导出
const { utilFunction } = await loadScript('/modules/utils.js', 'utilFunction');

// 允许空结果
const maybeEmpty = await loadScript('/modules/optional.js', undefined, false);
```

### 网络请求功能

#### `getRemoteString(url: string): Promise<string>`

获取远程字符串内容。

```typescript
const scriptContent = await getRemoteString('https://cdn.example.com/script.js');
```

#### `getData(url: string, params?: Record<string, any>): Promise<any>`

发送 GET 请求获取数据。

```typescript
const data = await getData('https://api.example.com/data', { page: 1 });
```

#### `postData(url: string, data?: any): Promise<any>`

发送 POST 请求提交数据。

```typescript
const result = await postData('https://api.example.com/submit', { name: 'example' });
```

### 工具函数

#### `getUrl(url: string): string`

根据配置的 baseURL 生成完整的资源路径。

```typescript
setCdnConfig({ baseURL: 'https://cdn.example.com' });
const fullUrl = getUrl('/assets/script.js');
// 返回: 'https://cdn.example.com/assets/script.js'
```

#### `getErrorHandler(errorHandler?: ErrorHandlerType): ErrorHandlerType`

获取错误处理器，优先级：传入参数 > 全局配置 > 默认 console.error。

```typescript
const handler = getErrorHandler((error) => alert(error.message));
```

## 类型定义

```typescript
export type ErrorHandlerType = (error: any) => void;

export interface CdnCoreConfigData {
  baseURL?: string;
  errorHandler?: ErrorHandlerType;
}
```

## 重试机制

`loadScript` 内置了智能重试机制：

1. **首次尝试**：直接加载资源
2. **第一次重试**：立即重试
3. **第二次重试**：延迟 100ms 后重试
4. **第三次重试**：延迟 200ms 后重试

如果所有重试都失败，将抛出详细的错误信息。

## 错误处理

### 内置错误类型

- **路径为空**：当 `path` 参数为空时抛出
- **资源导出错误**：当资源未正确导出任何变量时抛出（可通过 `emptyError` 参数控制）
- **网络错误**：当网络请求失败时抛出

### 自定义错误处理

```typescript
setCdnConfig({
  errorHandler: (error) => {
    // 发送错误到监控系统
    errorReporter.report(error);

    // 显示用户友好的错误信息
    showToast('资源加载失败，请刷新页面重试');
  }
});
```

## 调试模式

在浏览器中设置 `localStorage.setItem('ext-debug', '1')` 来启用调试模式，可以看到详细的加载日志。

```javascript
// 启用调试模式
localStorage.setItem('ext-debug', '1');

// 禁用调试模式
localStorage.removeItem('ext-debug');
```

## 最佳实践

### 1. 配置管理

```typescript
// 在应用初始化时统一配置
const initCdn = () => {
  setCdnConfig({
    baseURL: process.env.CDN_BASE_URL || 'https://cdn.example.com',
    errorHandler: (error) => {
      console.error('[CDN Error]:', error);
      // 可以集成错误监控服务
    }
  });
};
```

### 2. 错误边界

```typescript
const loadModuleWithFallback = async (path: string, fallback: any) => {
  try {
    return await loadScript(path);
  } catch (error) {
    console.warn(`加载 ${path} 失败，使用降级方案:`, error);
    return fallback;
  }
};
```

### 3. 类型安全

```typescript
interface MyModule {
  init: () => void;
  config: Record<string, any>;
}

const module = await loadScript<MyModule>('/modules/my-module.js');
module.init(); // TypeScript 类型提示
```

## 依赖

- `@frontendUtils/load-script`: 提供底层脚本加载能力

## 许可证

MIT © [xxld0125](https://github.com/xxld0125)

## 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: 添加新功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 更新日志

查看 [CHANGELOG.md](../../CHANGELOG.md) 了解详细的更新记录。
