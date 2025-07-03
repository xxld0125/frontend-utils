# @frontendUtils/cdn-vue2

Vue 2 动态组件加载器，用于从 CDN 动态加载远程 Vue 组件。

## 特性

- 🚀 动态加载远程 Vue 2 组件
- 🛡️ 完善的错误处理机制
- ⏳ 支持加载状态管理
- 🎨 可自定义加载和错误回退内容
- 📦 轻量级，基于 @frontendUtils/cdn-core
- 🔄 支持组件热更新

## 安装

```bash
npm install @frontendUtils/cdn-vue2
# 或
pnpm add @frontendUtils/cdn-vue2
# 或
yarn add @frontendUtils/cdn-vue2
```

## 基础使用

### 1. 全局配置

```javascript
import { startCdnComponent } from '@frontendUtils/cdn-vue2';

// 配置基础设置
startCdnComponent({
  baseURL: 'https://your-cdn-domain.com/',
  errorHandler: (error) => {
    console.error('CDN 组件加载失败:', error);
  },
  errorFallback: '组件加载失败，请重试',
  loadingFallback: '正在加载组件...'
});
```

### 2. 在 Vue 组件中使用

```vue
<template>
  <div>
    <h2>动态组件示例</h2>

    <!-- 基础用法 -->
    <CdnComponent
      url="components/my-component.js"
      :com-props="{ title: '动态标题', count: 10 }"
      :com-events="{ click: handleClick }"
      @loading="onLoading"
      @error="onError"
    />

    <!-- 指定导出名称 -->
    <CdnComponent
      url="components/named-exports.js"
      export-name="MySpecialComponent"
      :com-props="componentProps"
    />

    <!-- 自定义加载和错误内容 -->
    <CdnComponent url="components/slow-component.js">
      <template #loading>
        <div class="custom-loading">
          <span>正在加载精彩内容...</span>
        </div>
      </template>

      <template #error>
        <div class="custom-error">
          <p>哎呀，出错了！</p>
          <button @click="retry">重试</button>
        </div>
      </template>
    </CdnComponent>
  </div>
</template>

<script>
import { CdnComponent } from '@frontendUtils/cdn-vue2';

export default {
  components: {
    CdnComponent
  },
  data() {
    return {
      componentProps: {
        message: 'Hello from parent'
      }
    };
  },
  methods: {
    handleClick(data) {
      console.log('子组件点击事件:', data);
    },
    onLoading(isLoading) {
      console.log('组件加载状态:', isLoading);
    },
    onError(error) {
      console.error('组件加载错误:', error);
    },
    retry() {
      // 重新加载逻辑
      this.$forceUpdate();
    }
  }
};
</script>
```

## API 文档

### startCdnComponent(options)

全局配置函数。

#### 参数

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| baseURL | string | - | CDN 资源的基础 URL |
| errorHandler | function | - | 全局错误处理函数 |
| errorFallback | string \| object | - | 全局错误回退内容 |
| loadingFallback | string \| object | - | 全局加载回退内容 |

### CdnComponent 组件

#### Props

| 属性 | 类型 | 必填 | 默认值 | 描述 |
|------|------|------|--------|------|
| url | string | ✓ | - | 远程组件的 URL |
| exportName | string | ✗ | - | 模块的导出名称 |
| comProps | object | ✗ | {} | 传递给远程组件的属性 |
| comEvents | object | ✗ | {} | 传递给远程组件的事件 |
| errorHandler | function | ✗ | - | 组件级别的错误处理函数 |
| loadingHandler | function | ✗ | - | 组件级别的加载处理函数 |

#### 事件

| 事件名 | 参数 | 描述 |
|--------|------|------|
| loading | boolean | 加载状态变化时触发 |
| error | Error | 发生错误时触发 |

#### 插槽

| 插槽名 | 描述 |
|--------|------|
| default | 传递给远程组件的默认插槽内容 |
| loading | 自定义加载状态的显示内容 |
| error | 自定义错误状态的显示内容 |

## 远程组件开发规范

### 1. 标准组件导出

```javascript
// my-component.js
export default {
  name: 'MyComponent',
  props: ['title', 'count'],
  template: `
    <div>
      <h3>{{ title }}</h3>
      <p>计数: {{ count }}</p>
      <button @click="handleClick">点击</button>
    </div>
  `,
  methods: {
    handleClick() {
      this.$emit('click', { message: '来自远程组件的消息' });
    }
  }
};
```

### 2. 命名导出

```javascript
// named-exports.js
export const MySpecialComponent = {
  name: 'MySpecialComponent',
  template: '<div>特殊组件</div>'
};

export default {
  name: 'DefaultComponent',
  template: '<div>默认组件</div>'
};
```

## 常见问题

### Q: 组件加载失败怎么办？

A: 检查以下几点：
1. 确认 URL 路径正确
2. 确认远程文件确实导出了 Vue 组件
3. 检查网络连接
4. 查看浏览器控制台错误信息

### Q: 如何处理跨域问题？

A: 确保 CDN 服务器配置了正确的 CORS 头：
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

### Q: 支持 TypeScript 吗？

A: 是的，本包完全支持 TypeScript，提供了完整的类型定义。

## 许可证

MIT © xxld0125

## 相关包

- [@frontendUtils/cdn-core](../cdn-core) - 核心 CDN 加载功能
- [@frontendUtils/load-script](../load-script) - 脚本加载工具
