# @frontendUtils/ext-core

> 前端扩展点核心库，提供动态扩展点管理、CDN 脚本加载、缓存机制和错误处理等功能

## ✨ 特性

- 🔌 **动态扩展点管理** - 支持动态获取和执行扩展点
- 📦 **CDN 脚本加载** - 基于 `@frontendUtils/cdn-core` 的脚本加载能力
- 💾 **智能缓存机制** - 本地存储缓存，减少重复请求
- 🔄 **自动重试机制** - 请求失败时自动重试，提高稳定性
- 🛡️ **错误处理** - 完善的错误处理和上报机制
- 🎯 **条件匹配** - 支持自定义条件检查器
- 🌍 **环境适配** - 支持开发/测试/生产环境配置

## 📦 安装

```bash
# npm
npm install @frontendUtils/ext-core

# yarn
yarn add @frontendUtils/ext-core

# pnpm
pnpm add @frontendUtils/ext-core
```

## 🚀 快速开始

### 1. 初始化配置

```typescript
import { startExtCore } from '@frontendUtils/ext-core';

// 启动扩展点核心
startExtCore({
  appGroup: 'your-app-group',
  appName: 'your-app-name',
  devUseTestApi: true, // 开发环境使用测试 API
  errorHandler: error => {
    console.error('扩展点错误:', error);
  }
});
```

### 2. 使用扩展点

```typescript
import { extJs } from '@frontendUtils/ext-core';

// 创建扩展点函数
const processData = extJs({
  name: 'data-processor',
  checker: conditions => {
    // 检查条件是否满足
    return conditions.version === '1.0';
  },
  blockOnError: false,
  exportName: 'processData',
  originFn: data => {
    // 默认处理逻辑
    return data;
  },
  devUrl: 'http://localhost:3000/dev-processor.js' // 开发环境调试地址
});

// 使用扩展点
const result = await processData({ id: 1, name: 'test' });
```

## 📚 API 文档

### startExtCore(config)

启动扩展点核心功能

**参数:**

- `config: ExtCoreConfigData` - 配置对象

**ExtCoreConfigData 接口:**

```typescript
interface ExtCoreConfigData {
  appGroup?: string; // 应用分组
  appName?: string; // 应用名称
  devUseTestApi?: boolean; // 本地开发环境调用测试环境API
  errorHandler?: (error: any) => void; // 错误处理函数
  // ... 其他 cdn-core 配置项
}
```

### extJs(options)

创建 JavaScript 扩展点执行函数

**参数:**

- `options: ExtJsOptions` - 扩展点配置

**ExtJsOptions 接口:**

```typescript
interface ExtJsOptions<T = any> {
  name: string; // 扩展点名称
  checker: CheckerType; // 条件检查器
  blockOnError: boolean; // 错误时是否阻塞
  exportName?: string; // 导出函数名
  errorHandler?: (error: any) => void; // 错误处理函数
  originFn?: (...args: any[]) => T; // 原始逻辑函数
  devUrl?: string; // 开发环境调试地址
}

type CheckerType = (conditions: Record<string, string>) => boolean;
```

**返回值:**

- `(...args: any[]) => Promise<any>` - 扩展点执行函数

### extApi

扩展点 API 管理器

**方法:**

- `getExtList(): Promise<Ext[]>` - 获取扩展点列表
- `getExt(name: string, checker: CheckerType): Promise<Ext | undefined>` - 获取指定扩展点
- `reset(): void` - 重置缓存和状态

**Ext 接口:**

```typescript
interface Ext {
  name: string; // 扩展点名称
  type: 'cdn' | 'iframe' | 'image'; // 扩展点类型
  url: string; // 扩展点地址
  conditions: Record<string, string>; // 条件参数
}
```

### 配置管理

```typescript
import { getExtConfig, setExtConfig } from '@frontendUtils/ext-core';

// 设置配置
setExtConfig({
  appGroup: 'my-app-group',
  appName: 'my-app'
});

// 获取配置
const config = getExtConfig();
```

## 🔧 环境配置

在使用前，需要在全局注入环境配置：

```javascript
window.ENVIRONMENT_EXT = {
  env: 'dev', // 环境标识
  'ares-ext': 'https://api.example.com/ext', // 扩展点 API 地址
  'jarvis-node-id': 'your-node-id', // 节点 ID
  gateway: 'https://gateway.example.com' // 网关地址
};
```

## 💡 使用示例

### 基础示例

```typescript
import { extJs, startExtCore } from '@frontendUtils/ext-core';

// 1. 初始化
startExtCore({
  appGroup: 'ecommerce',
  appName: 'product-page',
  errorHandler: console.error
});

// 2. 创建扩展点
const customValidator = extJs({
  name: 'form-validator',
  checker: conditions => conditions.formType === 'product',
  blockOnError: false,
  exportName: 'validate',
  originFn: formData => {
    // 默认验证逻辑
    return { valid: true, errors: [] };
  }
});

// 3. 使用扩展点
const validationResult = await customValidator({
  name: 'iPhone 15',
  price: 999
});

console.log(validationResult);
```

### 高级示例 - 条件匹配

```typescript
const conditionalProcessor = extJs({
  name: 'data-processor',
  checker: conditions => {
    const { userRole, feature } = conditions;
    // 只有管理员用户且启用了高级功能时才使用扩展点
    return userRole === 'admin' && feature === 'advanced';
  },
  blockOnError: true,
  exportName: 'processAdvancedData',
  originFn: data => {
    // 基础处理逻辑
    return { processed: data, level: 'basic' };
  }
});

// 使用时会根据条件决定是否使用扩展点
const result = await conditionalProcessor(userData);
```

### 错误处理示例

```typescript
const robustProcessor = extJs({
  name: 'critical-processor',
  checker: conditions => conditions.enabled === 'true',
  blockOnError: false, // 错误时回退到原始逻辑
  errorHandler: error => {
    // 自定义错误处理
    console.error('扩展点执行失败:', error);
    // 可以上报到监控系统
    reportError(error);
  },
  originFn: data => {
    // 确保总是有回退逻辑
    return processDataSafely(data);
  }
});
```

## 🐛 调试

启用调试模式：

```javascript
// 在浏览器控制台执行
localStorage.setItem('ext-debug', 'true');

// 然后刷新页面，会看到详细的调试日志
```

## 📝 许可证

MIT © [xxld0125](https://github.com/xxld0125)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📦 相关包

- [@frontendUtils/cdn-core](../cdn-core) - CDN 核心加载库
- [@frontendUtils/load-script](../load-script) - 脚本加载工具
