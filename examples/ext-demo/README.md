# vue2 扩展点模板

本文档工具基于 [vuepress](https://www.vuepress.cn/) 和 [Vue CLI](https://cli.vuejs.org/zh/guide/build-targets.html#%E5%BA%93)，用于构建 Vue 技术栈扩展点。

## 快速开始

### 1. 修改标识

- 修改 `package.json` 中的 `name` 值
- `scripts` 中 `build` 中的 `--name` 值

### 2. 安装依赖

```bash
yarn
```

### 3. 本地启动

> 可以删除 src/HelloWorld.vue 以及 docs/demos、docs/README.md 中的内容，仅作为示例

```bash
yarn dev # 启动本地开发和调试（初次会提示安装 vuepress）
```

如果打包需要排除依赖，需要修改 `vue.config.js`。

> 第一次运行请全局安装 vuepress

### 5. 构建上传

> 第一次执行失败，不要怕，去静态资源管理平台上获取 token，重新执行一遍即可

```bash
yarn upload # 构建扩展点并上传扩展点
```

## 注意事项

### sass 和 less 预处理器

如果用到 sass 或则 less，请分别在全局和本地都安装，vuepress 基于 `webpack4`、vue-cli 基于 `webpack5`。

```bash
yarn global add sass sass-loader@^10 # 给 vuepress 用的
yarn add sass sass-loader # 给 vue-cli 用的
```

```bash
yarn global add less less-loader@^5
yarn add less less-loader # 给 vue-cli 用的
```

### 接口转发

如果需要用到 webpack `devServer` 请修改 `docs/.vuepress/config.js` 文件。

## 技术栈

vue + vue-cli + scss + [vuepress](https://www.vuepress.cn/)

如果想要修改打包设置，可以修改 `.vue.config.js` 文件

## 项目设计结构

```bash
.
├── README.md
├── babel.config.js
├── dist
├── docs # 本地开发和文档目录
│   ├── README.md # markdown 语法写文档
│   ├── demos # 写 demo 示例的地方（示例可删除）
│   │   ├── Demo1.vue
│   │   └── Demo2.vue
│   └── main.js # 文档初始化注册全局组件等
├── jsconfig.json
├── package.json
├── src # 源码目录
│   ├── HelloWorld.vue # 示例可删除
│   └── index.js
├── vue.config.js # 扩展点打包配置
└── yarn.lock
```

## 使用

使用方式参照 `docs/README.md` 示例。
