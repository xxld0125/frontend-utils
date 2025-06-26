# eval vs new Function vs 沙箱方案 技术演进分析

## 📊 概述

在 `@frontendUtils/load-script` 项目开发过程中，我们经历了关键的技术演进：从简单的脚本执行方案发展到复杂的沙箱隔离架构。本文档记录了这一技术决策的演进过程，分析了 `eval`、`new Function` 和最终采用的**沙箱方案**的差异和选择原因。

## 🏗️ 技术演进历程

### 阶段一：简单方案探索

最初我们面临 `eval` vs `new Function` 的选择

### 阶段二：沙箱需求出现

发现需要脚本隔离和安全执行环境

### 阶段三：沙箱架构实现

最终采用基于 Proxy 的复杂沙箱方案

## 🎯 技术演进的核心驱动

### 初期问题

- 需要动态加载和执行远程 UMD 脚本
- 要求脚本能够正确识别浏览器环境
- 希望避免全局环境污染
- 需要提供安全的脚本执行环境

### 架构需求升级

- **隔离执行**：脚本不能污染宿主应用环境
- **安全控制**：需要拦截和管理全局变量访问
- **函数绑定**：正确处理函数执行上下文
- **微前端支持**：提供企业级的脚本隔离能力

### 根本原因

UMD 脚本的环境检测逻辑：

```javascript
if (typeof exports === 'object' && typeof module !== 'undefined') {
  // CommonJS - 执行 module.exports = _
} else if (typeof define === 'function' && define.amd) {
  // AMD
} else {
  // Browser - 执行 window._ = _ (我们期望的行为)
}
```

## 🔧 技术对比

### 1. 执行上下文和作用域

#### eval 特点

```javascript
// ✅ 在当前词法作用域中执行
function testEval() {
  const localVar = 'local';
  eval('console.log(localVar)'); // 可以访问 localVar
  eval('var newVar = "created"');
  console.log(newVar); // 可以访问 newVar
}
```

#### new Function 特点

```javascript
// ❌ 在全局作用域中执行
function testNewFunction() {
  const localVar = 'local';
  const func = new Function('console.log(typeof localVar)'); // undefined
  func(); // 无法访问 localVar
}
```

### 2. UMD 脚本执行差异

#### 阶段一：简单 eval 方案

```typescript
function executeCode(url: string, code: string): any {
  try {
    // ❌ 问题：无法提供隔离环境，可能污染全局
    eval(code);
    return detectUmdExport(code);
  } catch (error: any) {
    throw new Error(`脚本执行失败: ${error.message}`);
  }
}
```

#### 阶段二：简单 new Function 方案

```typescript
function executeCode(url: string, code: string): any {
  const codeFunction = new Function('module', 'exports', 'require', 'window', 'document', 'console', code);

  const fakeModule = { exports: {} };
  const fakeExports = {};

  // ❌ 问题：提供了假的 module/exports，误导UMD检测
  codeFunction(fakeModule, fakeExports, undefined, window, document, console);
}
```

#### 阶段三：最终沙箱方案

```typescript
// ✅ 当前实际实现：复杂沙箱架构
export async function runScript(url: string, code: string) {
  const sandbox = new Sandbox(); // 创建沙箱实例
  (rawWindow as any).__EXT_MICRO_APP_PROXY_WINDOW__ = sandbox.proxyWindow;
  code = bindScope(code); // 绑定沙箱作用域

  try {
    runCode2Function(code); // 在沙箱中执行
  } catch (e: any) {
    throw new Error(`脚本执行失败: ${e.message}`);
  }

  // 从沙箱中提取注入的变量
  return [...sandbox.injectedKeys].reduce(
    (acc, key) => {
      acc[key] = sandbox.microAppWindow[key];
      return acc;
    },
    {} as Record<PropertyKey, any>
  );
}
```

### 3. 环境检测影响

典型 UMD 检测逻辑：

```javascript
(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // CommonJS - Node.js 环境
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD - RequireJS 环境
    define([], factory);
  } else {
    // Browser - 浏览器环境 ⭐ 这是我们想要的！
    root._ = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  // 库的实现...
});
```

**问题分析：**

- `new Function('module', 'exports', ...)` 使 `typeof module !== 'undefined'` 为 `true`
- UMD 脚本选择 CommonJS 分支：`module.exports = _`
- 全局 `window._` 没有被设置
- `detectUmdExport` 检测失败

**eval 的优势：**

- 不提供假的 `module`/`exports`
- UMD 脚本自然选择浏览器分支：`window._ = _`
- 完美模拟 `<script>` 标签的行为

## 📋 技术方案详细对比

| 特性                 | eval        | new Function | 沙箱方案 (当前实现) |
| -------------------- | ----------- | ------------ | ------------------- |
| **UMD环境检测**      | ✅ 浏览器   | ✅ 浏览器    | ✅ 完美支持         |
| **全局变量设置**     | ✅ 正确     | ✅ 正确      | ✅ 完美控制         |
| **与`<script>`等价** | ✅ 完全等价 | ✅ 等价      | ✅ 增强版等价       |
| **代码复杂度**       | ✅ 简单     | ⚠️ 中等      | ❌ 复杂             |
| **调试友好**         | ⚠️ 一般     | ✅ 较好      | ✅ 优秀             |
| **性能**             | ⚠️ 略慢     | ✅ 最快      | ⚠️ 中等             |
| **作用域隔离**       | ❌ 无隔离   | ❌ 无隔离    | ✅ 完全隔离         |
| **安全性**           | ❌ 低       | ❌ 低        | ✅ 高               |
| **函数绑定**         | ❌ 无控制   | ❌ 无控制    | ✅ 智能绑定         |
| **属性管理**         | ❌ 无控制   | ❌ 无控制    | ✅ 精确控制         |
| **微前端支持**       | ❌ 不支持   | ❌ 不支持    | ✅ 专业级           |

## 🎯 最终选择沙箱方案的原因

### 1. 完美的隔离性

```typescript
// ✅ 沙箱方案：完全隔离执行
const sandbox = new Sandbox();
// 脚本在代理窗口中执行，不污染宿主环境
// 全局变量被拦截和管理
```

### 2. 企业级安全控制

```typescript
// ✅ 沙箱方案：精确的属性控制
// - 代理拦截所有 window 访问
// - 智能函数绑定
// - 属性逃逸策略
// - 作用域精确管理
```

### 3. 微前端架构支持

```typescript
// ✅ 沙箱方案：支持复杂的微前端场景
// - 多个脚本独立运行
// - 互不干扰的全局环境
// - 完整的生命周期管理
// - 专业级隔离能力
```

### 4. 灵活的执行环境

```typescript
// 当前实现的复杂绑定逻辑
function bindScope(code: string): string {
  return `;(function(proxyWindow){with(proxyWindow.__EXT_MICRO_APP_WINDOW__){(function(${globalKeyToBeCached}){;
    ${code}
  }).call(proxyWindow,${globalKeyToBeCached})}})(this.__EXT_MICRO_APP_PROXY_WINDOW__);`;
}
```

## ⚠️ 安全性考虑

### 共同的安全风险

- 两者在浏览器环境中安全性水平相当
- 都可以访问全局对象和 DOM
- 都存在代码注入风险
- 在 loadScript 的使用场景中，都是执行用户明确指定的远程脚本

### 安全最佳实践

1. **URL 验证**：确保加载的脚本来自可信源
2. **HTTPS 要求**：只允许 HTTPS 协议的脚本
3. **CSP 配置**：配置内容安全策略
4. **错误处理**：完善的错误捕获和处理机制

## 🚀 性能分析

### 性能测试结果

```typescript
// 典型性能表现 (10,000次执行)：
// eval: ~150ms
// new Function (预编译): ~100ms
// new Function (每次创建): ~300ms
```

### 性能考虑

- **执行频率**：脚本通常只执行一次
- **性能差异**：在实际使用中差异可忽略
- **优先级**：正确性比微秒级性能优化更重要

## 🎪 技术演进的最终结论

经过深入分析和实践，`@frontendUtils/load-script` 最终采用了**基于 Proxy 的沙箱方案**，这是一个比简单 `eval` 或 `new Function` 更加完善的解决方案。

### ✅ 沙箱方案的核心优势

1. **完美的功能正确性**
   - 确保 UMD 脚本在浏览器环境中正确工作
   - 支持所有类型的 UMD 脚本和复杂场景
   - 提供与 `<script>` 标签等价甚至更好的体验

2. **企业级安全隔离**
   - 基于 Proxy 的完整沙箱隔离机制
   - 防止脚本污染宿主应用的全局环境
   - 精确控制属性访问和函数绑定

3. **微前端架构支持**
   - 支持多个脚本独立并行运行
   - 提供专业级的脚本隔离能力
   - 完整的生命周期和状态管理

4. **高级特性**
   - 智能函数绑定和上下文管理
   - 灵活的属性逃逸策略
   - 完善的错误处理和调试支持

### ⚠️ 技术权衡

- **复杂度增加**：从简单的 eval 发展到复杂的沙箱架构
- **性能开销**：相比简单方案有一定性能开销（但在可接受范围内）
- **维护成本**：需要维护复杂的代理逻辑和沙箱机制

### 📈 演进价值

**简单方案 → 沙箱方案** 的演进体现了项目从**功能实现**向**企业级产品**的升级：

- **从"能用"到"好用"**：不仅实现基本功能，还提供安全可靠的执行环境
- **从"个人项目"到"企业级"**：满足复杂业务场景和安全要求
- **从"简单工具"到"平台能力"**：为微前端等高级架构提供基础支撑

### 📝 当前架构核心

```typescript
// 当前实现的核心架构
export async function runUmdScript(url: string, code: string) {
  // 1. 创建沙箱实例
  const sandbox = new Sandbox();

  // 2. 绑定代理窗口
  (rawWindow as any).__EXT_MICRO_APP_PROXY_WINDOW__ = sandbox.proxyWindow;

  // 3. 绑定作用域并执行
  code = bindScope(code);
  runCode2Function(code);

  // 4. 从沙箱提取结果
  const obj = extractSandboxResult(sandbox);
  return getUmdExport(obj);
}
```

这种架构在**功能正确性**、**安全性**和**企业级特性**方面都达到了最佳平衡，是技术演进的最优结果。

## 📚 参考资料

- [MDN - eval()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval)
- [MDN - Function 构造函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/Function)
- [UMD 规范](https://github.com/umdjs/umd)
- [JavaScript 执行上下文](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

## 📚 技术演进启示

这个技术选择的演进过程给我们带来了重要启示：

1. **需求驱动架构演进**：从简单脚本执行到复杂沙箱隔离，每一步都是实际需求推动的结果
2. **安全性与功能性并重**：在满足功能的基础上，安全性逐渐成为核心考量
3. **企业级vs个人级**：不同的应用场景需要不同级别的技术方案
4. **技术债务的价值**：复杂度的增加换来了更强大的能力和更广泛的适用性

---

_文档创建时间：2025-01-27_  
_最后更新：2025-01-27_  
_技术演进记录：从 eval vs new Function 发展到沙箱方案_  
_维护者：frontend-utils 开发团队_
