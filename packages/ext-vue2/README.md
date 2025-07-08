# @frontendUtils/ext-vue2

Vue 2 扩展点组件库，支持动态加载远程扩展点组件和逻辑。

## 特性

- 🚀 动态加载远程 UMD 组件
- 🎯 支持扩展点条件检测
- 🔄 内置加载状态和错误处理
- 🛡️ 支持沙箱隔离（可选）
- 📦 轻量级，易于集成

## 安装

```bash
npm install @frontendUtils/ext-vue2
# 或
yarn add @frontendUtils/ext-vue2
# 或
pnpm add @frontendUtils/ext-vue2
```

## 快速开始

### 初始化

```javascript
import { extApp } from '@frontendUtils/ext-vue2';

// 初始化扩展点应用
extApp({
  // 扩展点核心配置
  baseUrl: 'https://your-ext-api.com',
  timeout: 5000,

  // CDN 组件配置
  errorFallback: '加载失败，请重试',
  loadingFallback: '正在加载...',
  enableSandbox: false,
});
```

### 使用扩展点组件

```vue
<template>
  <div>
    <h1>主应用内容</h1>

    <!-- 扩展点组件 -->
    <ExtComponent
      name="user-dashboard"
      :checker="checkCondition"
      :block-on-error="true"
      :com-props="{ userId: 123, userName: 'John' }"
      :com-events="{ onUserUpdate: handleUserUpdate }"
      @loading="onLoading"
      @error="onError"
    >
      <!-- 默认内容（扩展点不存在时显示） -->
      <div>默认用户面板</div>

      <!-- 自定义加载状态 -->
      <template #loading>
        <div>自定义加载中...</div>
      </template>

      <!-- 自定义错误状态 -->
      <template #error>
        <div>自定义错误提示</div>
      </template>
    </ExtComponent>
  </div>
</template>

<script>
import { ExtComponent } from '@frontendUtils/ext-vue2';

export default {
  components: {
    ExtComponent
  },
  methods: {
    // 检测函数：决定是否加载扩展点
    checkCondition(conditions) {
      return conditions.orgCode === this.$store.state.user.orgCode;
    },

    handleUserUpdate(userData) {
      console.log('用户更新:', userData);
    },

    onLoading(isLoading) {
      console.log('加载状态:', isLoading);
    },

    onError(error) {
      console.error('扩展点错误:', error);
    }
  }
}
</script>
```

## API 参考

### extApp(options)

初始化扩展点应用配置。

**参数：**
- `options` - 配置对象，包含扩展点核心配置和 CDN 组件配置

### ExtComponent 组件属性

| 属性 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| `name` | `String` | ✅ | - | 扩展点标识符 |
| `checker` | `Function` | ✅ | - | 条件检测函数 |
| `blockOnError` | `Boolean` | ✅ | `true` | 错误时是否阻塞原流程 |
| `exportName` | `String` | ❌ | - | 指定导出的组件名称 |
| `comProps` | `Object` | ❌ | `{}` | 传递给扩展点组件的属性 |
| `comEvents` | `Object` | ❌ | `{}` | 传递给扩展点组件的事件 |
| `errorHandler` | `Function` | ❌ | - | 自定义错误处理函数 |
| `loadingHandler` | `Function` | ❌ | - | 自定义加载状态处理函数 |
| `devUrl` | `String` | ❌ | - | 开发环境下的调试链接 |

### ExtComponent 事件

| 事件 | 参数 | 描述 |
|------|------|------|
| `loading` | `(isLoading: boolean)` | 加载状态变化 |
| `error` | `(error: any)` | 发生错误时触发 |

### ExtComponent 插槽

| 插槽 | 描述 |
|------|------|
| `default` | 默认内容（扩展点不存在时显示） |
| `loading` | 自定义加载状态显示 |
| `error` | 自定义错误状态显示 |

## 开发扩展点

### 创建扩展点组件

```javascript
// extension.js - 扩展点组件
export default {
  name: 'UserDashboardExtension',
  props: ['userId', 'userName'],
  template: `
    <div class="user-dashboard-ext">
      <h2>扩展用户面板</h2>
      <p>用户ID: {{ userId }}</p>
      <p>用户名: {{ userName }}</p>
      <button @click="updateUser">更新用户</button>
    </div>
  `,
  methods: {
    updateUser() {
      this.$emit('onUserUpdate', {
        id: this.userId,
        name: this.userName,
        updatedAt: new Date()
      });
    }
  }
}
```

### 构建为 UMD

```javascript
// vite.config.js
export default {
  build: {
    lib: {
      entry: './src/extension.js',
      name: 'UserDashboardExtension',
      formats: ['umd'],
      fileName: 'index'
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
}
```

## 开发环境调试

设置环境变量进行本地调试：

```javascript
// 设置开发环境标识
window.ENVIRONMENT_EXT = { env: 'dev' };
```

```vue
<ExtComponent
  name="user-dashboard"
  :checker="checkCondition"
  dev-url="http://localhost:3000/dist/index.umd.js"
>
  <!-- 组件内容 -->
</ExtComponent>
```

## 错误处理策略

### blockOnError 配置

```javascript
// 总是显示错误，阻塞原流程
blockOnError: true

// 总是走原逻辑，不阻塞
blockOnError: false

// 条件性阻塞
blockOnError: ['特定机构代码'].includes(this.orgCode)
```

## 注意事项

1. **Vue 版本要求**：需要 Vue 2.6+ 版本
2. **扩展点组件**：必须构建为 UMD 格式
3. **全局依赖**：扩展点组件可以使用全局的 Vue、第三方库等
4. **沙箱隔离**：可选开启，提供 JS/CSS 隔离
5. **错误边界**：组件内置错误处理，确保主应用稳定性

## 相关包

- [@frontendUtils/ext-core](../ext-core) - 扩展点核心逻辑
- [@frontendUtils/cdn-vue2](../cdn-vue2) - Vue 2 CDN 组件加载器
- [@frontendUtils/load-script](../load-script) - 脚本加载工具

## 许可证

MIT © xxld0125
