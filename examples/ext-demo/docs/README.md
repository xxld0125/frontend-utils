# 组件文档编写

## 一、文档工具使用说明

本文档工具基于 [vuepress](https://www.vuepress.cn/)，用于扩展点本地的开发和调试，具体可以看一下 [ant-deisgn ](https://ant.design/components/button-cn/)或者 [element-ui](https://element-plus.gitee.io/)。

### 全局配置

我们可以在 `src/main.js` 进行一些全局的处理和组件注册等操作。例如注册 `ElementUI`：

```js
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css';

export function start(Vue) {
  Vue.use(ElementUI)
}
```

### 示例开发

#### 全局组件方式

我们可以在 `docs/demos` 进行 demo 的编写，其会**自动注册成全局组件**，并且 `src/**.vue` 也会自动注册成全局组件，所以你不必引用就可以直接使用。

```html
<!-- docs/demos/Demo1.vue -->
<template>
  <div>
    <hello-world msg='demo1 示例' />
  </div>
</template>
```

```html
<!-- markdown 中直接使用 -->
<demo1 />
```

效果如下：

<demo1 />

#### 自主引入方式


```html
<!-- docs/demos/Demo2.vue -->
<template>
  <div>
    <hello-wo msg='demo2 示例' />
  </div>
</template>

<script>
import HelloWorld from '@src/HelloWorld'

export default {
  components: {
    HelloWo: HelloWorld
  }
}
</script>
```

```html
<!-- markdown 中直接使用 -->
<demo2 />
```

效果如下：

<demo2 />


## 二、编写规范

- 明确导出方式
- 明确导出内容
- 明确导出内容的属性

### 2.1 明确导出方式和内容

导出方式根据需求不同分为：

- 默认导出
- 具名导出

**默认导出**仅针对一个扩展点仅涉及一个内容，例如一个表单扩展点，仅需要导出一个 React 组件的示例：

```js
// 默认导出示例
import UserForm from './Foo';

export default UserForm;
```

文档展示建议：

| 导出内容 | 类型       | 作用             |
| -------- | ---------- | ---------------- |
| 默认导出 | Vue 组件 | 扩展用户表单字段 |

**具名导出**是一个需求可能需要多个动作才能完成，例如需要扩展一个表单，不仅需要增加表单字段，还可以自定义创建函数，所以就需要导出多个内容，具体如下：

```javascript
// 具名导出示例
import UserForm from './Foo';
import createUser from './getUser';

export { UserForm, createUser };
```

文档展示建议：

| 导出内容   | 类型       | 作用             |
| ---------- | ---------- | ---------------- |
| UserForm   | React 组件 | 扩展用户表单字段 |
| createUser | 函数       | 自定义创建用户   |

### 2.2 明确导出内容的属性

我们需要对每个导出的内容进行参数或者 Props 属性的说明，方面用户使用这些属性。具体可以看一下 [ant-deisgn ](https://ant.design/components/button-cn/)或者 [element-ui](https://element-plus.gitee.io/)。

假如我们导出的是一个 Button 组件为例，它的文档应为：

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| **block** | 将按钮宽度调整为其父宽度的选项 | `boolean` | `false` |
| **danger** | 设置危险按钮 | `boolean` | `false` |
| **disabled** | 按钮失效状态 | `boolean` | `false` |
| **ghost** | 幽灵属性，使按钮背景透明 | `boolean` | `false` |

> 如果是导出多个内容，应该是要有多个表格的。

