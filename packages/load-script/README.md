# @frontendUtils/load-script

## 🚀 概述

`@frontendUtils/load-script` 是一个基于沙箱隔离技术的动态 JavaScript 脚本加载器，专门用于安全地加载和执行远程 **UMD (Universal Module Definition)** 格式的脚本。它提供了微前端级别的脚本隔离能力，确保脚本执行不会污染宿主环境。

## ✨ 特性

- 🛡️ **沙箱隔离**：基于 Proxy 的完整沙箱机制，提供安全的脚本执行环境
- 🔄 **UMD脚本加载**：专门支持UMD格式的脚本库动态加载
- 🪟 **代理窗口**：创建代理 window 对象，拦截和管理全局变量访问
- 💾 **智能缓存**：避免重复加载相同脚本，提升性能
- 🌐 **HTTP 请求**：提供便捷的 GET/POST 数据请求功能
- 🔍 **错误处理**：完善的错误捕获和提示机制
- 🎯 **函数绑定**：自动将函数绑定到正确的执行上下文
- 🔒 **属性隔离**：支持属性逃逸策略，灵活控制全局变量的可见性

## 📦 安装

```bash
pnpm install @frontendUtils/load-script
```

## 🎯 基本用法

### 在沙箱中加载UMD格式脚本

```javascript
import { loadScript } from '@frontendUtils/load-script';

// 在隔离沙箱中加载 Lodash (UMD格式)
const _ = await loadScript('https://unpkg.com/lodash@4.17.21/lodash.min.js');
console.log(_.chunk([1, 2, 3, 4, 5, 6], 2)); // [[1, 2], [3, 4], [5, 6]]
// 注意：脚本在沙箱中执行，不会污染全局 window 对象

// 在沙箱中加载 Vue 3 (UMD格式)
const Vue = await loadScript('https://unpkg.com/vue@3/dist/vue.global.js');
const app = Vue.createApp({
  template: '<div>Hello from sandboxed Vue!</div>'
});

// 在沙箱中加载 Chart.js (UMD格式)
const Chart = await loadScript('https://unpkg.com/chart.js@4/dist/chart.umd.js');
const ctx = document.getElementById('myChart').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    /* 数据 */
  },
  options: {
    /* 配置 */
  }
});
```

### HTTP 请求

```javascript
import { getData, getRemoteString, postData } from '@frontendUtils/load-script';

// GET 请求
const user = await getData('https://api.example.com/user/1');

// POST 请求
const result = await postData(
  'https://api.example.com/users',
  {
    name: 'John',
    email: 'john@example.com'
  },
  {
    Authorization: 'Bearer token'
  }
);

// 获取远程文本内容
const content = await getRemoteString('https://example.com/data.txt');
```

### 沙箱特性演示

```javascript
import { loadScript } from '@frontendUtils/load-script';

// 加载多个库而不会相互干扰
const moment = await loadScript('https://unpkg.com/moment@2.29.4/moment.js');
const dayjs = await loadScript('https://unpkg.com/dayjs@1.11.10/dayjs.min.js');

// 每个库都在独立的沙箱环境中运行
console.log(moment().format('YYYY-MM-DD'));
console.log(dayjs().format('YYYY-MM-DD'));

// 全局 window 对象保持清洁，不会被污染
console.log(window.moment); // undefined
console.log(window.dayjs); // undefined
```

## ⚠️ 重要说明

### 沙箱隔离机制

本工具库采用**基于 Proxy 的沙箱隔离技术**，确保脚本在安全的隔离环境中执行：

- **隔离执行**：每个脚本在独立的代理窗口中运行
- **防止污染**：脚本执行不会影响宿主应用的全局变量
- **安全控制**：完整的属性访问拦截和管理机制
- **函数绑定**：自动处理函数上下文绑定问题

### 支持UMD格式

本工具库**专门支持UMD (Universal Module Definition)格式**的JavaScript脚本。UMD是一种通用模块定义格式，能够同时兼容：

- CommonJS (Node.js)
- AMD (RequireJS)
- 浏览器全局变量

### UMD脚本在沙箱中的执行流程

```javascript
// UMD脚本模式
(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // CommonJS - 在沙箱中会被正确处理
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD - 在沙箱中会被正确处理
    define([], factory);
  } else {
    // Browser globals - 在代理窗口中设置全局变量
    global.LibraryName = factory();
  }
})(proxyWindow, function () {
  // 库的实现代码在沙箱中安全执行
  return LibraryObject;
});
```

### 推荐的UMD库

以下是一些支持UMD格式的流行JavaScript库：

- **Lodash**: `https://unpkg.com/lodash@4.17.21/lodash.min.js`
- **Vue 3**: `https://unpkg.com/vue@3/dist/vue.global.js`
- **Chart.js**: `https://unpkg.com/chart.js@4/dist/chart.umd.js`
- **Day.js**: `https://unpkg.com/dayjs@1.11.10/dayjs.min.js`
- **Axios**: `https://unpkg.com/axios@1.6.2/dist/axios.min.js`

## 🧪 测试和演示

### 运行测试

```bash
# 进入项目目录
cd packages/load-script

# 运行所有测试
pnpm test

# 运行测试并查看覆盖率
pnpm test:coverage

# 监听模式运行测试
pnpm test:watch
```

测试涵盖内容：

- 🛡️ **沙箱隔离测试**：验证脚本隔离执行效果
- 🔧 **UMD脚本验证**：自动检测并验证加载的UMD脚本功能
- 🪟 **代理窗口测试**：验证代理窗口的属性拦截和管理
- 📊 **性能监控**：测试加载时间和缓存效果
- ❌ **错误处理测试**：验证各种错误场景的处理
- 🎯 **函数绑定测试**：验证函数上下文绑定的正确性

## 📚 技术文档

### 重要技术决策

- 📄 [eval vs new Function 技术对比分析](./docs/eval-vs-new-function.md)
- 📖 [沙箱架构设计文档](./docs/README.md)

### 核心概念

- **沙箱隔离**：基于 Proxy 的完整沙箱隔离机制
- **代理窗口**：拦截和管理所有 window 对象操作
- **函数绑定**：自动处理函数执行上下文的绑定问题
- **属性管理**：支持属性逃逸、作用域控制等高级特性
- **UMD 优化**：专门为UMD格式脚本优化的执行环境
- **缓存策略**：基于URL的智能缓存机制

## 🔧 API 参考

### loadScript(url: string)

在沙箱环境中动态加载远程UMD JavaScript脚本。

**参数：**

- `url` - UMD脚本的远程URL

**返回：** `Promise<any>` - UMD脚本的导出对象（从沙箱中提取）

**特性：**

- 脚本在隔离的沙箱环境中执行
- 自动缓存加载结果，避免重复请求
- 支持完整的错误处理和日志记录
- 不会污染宿主应用的全局环境

**抛出：** 如果脚本加载失败或执行出错，会抛出详细的错误信息

### getRemoteString(url: string)

获取远程文本内容。

**参数：**

- `url` - 资源的远程URL

**返回：** `Promise<string>` - 文本内容

### getData<T>(url: string, headers?: Record<string, string>)

发送 GET 请求。

**参数：**

- `url` - 请求URL
- `headers` - 可选的请求头

**返回：** `Promise<T>` - 响应数据

### postData<T>(url: string, data: Record<string, any>, headers?: Record<string, string>)

发送 POST 请求。

**参数：**

- `url` - 请求URL
- `data` - 请求数据
- `headers` - 可选的请求头

**返回：** `Promise<T>` - 响应数据

## 🛡️ 安全考虑

### 沙箱安全特性

- ✅ **隔离执行**：脚本在独立沙箱中运行，无法直接访问宿主环境
- ✅ **代理拦截**：所有 window 对象访问都被代理拦截和管理
- ✅ **属性隔离**：防止脚本污染宿主应用的全局变量
- ✅ **函数绑定控制**：自动处理函数上下文，防止意外的作用域泄露

### 基础安全建议

- ✅ 只加载明确指定的UMD格式脚本
- ✅ 建议只加载来自可信源的脚本
- ✅ 推荐使用 HTTPS 协议
- ✅ 配合 CSP (Content Security Policy) 使用
- ✅ 定期审查加载的远程脚本源

### 注意事项

- ⚠️ 沙箱提供隔离但不能完全阻止恶意代码
- ⚠️ 仍需要验证脚本来源的可信度
- ⚠️ 建议在测试环境中充分验证脚本行为

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: 添加某个功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

> 💡 **提示**：查看 [技术文档](./docs/) 了解沙箱隔离机制、UMD格式支持和最佳实践。🏗️ **架构说明**：本工具基于微前端沙箱技术构建，提供企业级的脚本隔离能力。
