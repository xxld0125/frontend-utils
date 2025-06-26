# frontend-utils

该仓库是前端工具库集合,`monorepo` 仓库(`pnpm workspace`) 包括

- 前端通用配置
- 模版仓库一键初始化工具

## 配置项

- `prettier`
  - `prettier-plugin-jsdoc`: 自动排序 JavaScript 和 TypeScript 导入
  - `prettier-plugin-sorted`: 用于格式化注释块。

- eslint
  - `@eslint/js` - ESLint 官方推荐配置
  - `eslint-plugin-import`: `import/export` 语法检查
  - `eslint-plugin-promise`: 强制执行`promise` 最佳实践
  - `eslint-plugin-unicorn` - 现代 JavaScript 实践，ES Module 优化
  - `eslint-plugin-n` - Node.js 最佳实践
  - `eslint-plugin-sonarjs` - 代码质量检测，适合工具库
  - `eslint-plugin-jsdoc` - JSDoc 注释规范

- `typescript`
  - `@types/node`: Node.js 的 TypeScript 类型定义包

  - `@typescript-eslint/eslint-plugin`: 为 TypeScript 代码提供额外的 lint 规则
  - `@typescript-eslint/parser`: 让 ESLint 能够理解和解析 TypeScript 代码
  - `tslib`: TypeScript 的运行时库，帮助生成更高效、体积更小的 JavaScript 代码，特别是当项目需要支持较老的浏览器环境时。

- `cspell`: 代码拼写检查器

- `lint-staged`: 只对 Git 暂存区（staged）文件运行 linters 的工具
- `husky`: git hooks 管理工具
- `conventional-changelog-cli`: 自动生成 changelog

- `@commitlint/cli`: 检查 Git 提交信息是否符合指定的规范
  - `@commitlint/config-conventional`: commitlint 的约定式提交规范配置，基于 Angular 团队的提交信息约定

- `@babel/core`: Babel 的核心引擎，是整个 Babel 工具链的基础, 提供转换能力
  - `@babel/preset-env`: 决定转换规则, 确保浏览器兼容性
  - `@babel/plugin-transform-runtime`: 运行时转换插件，用于优化 Babel 编译后的代码
