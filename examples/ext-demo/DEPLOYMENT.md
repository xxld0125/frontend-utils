# 📦 Ext Demo UMD 模块部署指南

本文档介绍如何将 `index.umd.js` 文件部署到本地服务器上。

## 🚀 快速开始

### 方法一：使用启动脚本（推荐）

```bash
# 进入项目目录
cd examples/ext-demo

# 启动本地服务器（默认端口 3000）
./start-server.sh

# 或指定端口
./start-server.sh 8080
```

### 方法二：使用 npm 脚本

```bash
# 进入项目目录
cd examples/ext-demo

# 启动服务器
npm run serve-dist
```

### 方法三：手动启动

```bash
# 进入项目目录
cd examples/ext-demo

# 使用 serve 包启动静态文件服务器
npx serve --cors dist -p 3000
```

## 🌐 访问地址

服务器启动后，可以通过以下地址访问：

- **主页面**: http://localhost:3000
- **UMD 文件**: http://localhost:3000/index.umd.js
- **测试页面**: http://localhost:3000/demo.html

## 📋 在其他项目中使用

### 1. 直接引用（Script 标签）

```html
<!DOCTYPE html>
<html>
<head>
    <title>使用 Ext Demo</title>
</head>
<body>
    <!-- 引入 UMD 模块 -->
    <script src="http://localhost:3000/index.umd.js"></script>
    <script>
        // 使用全局变量访问模块
        const extDemo = window['ext-demo_1751967884260'];
        console.log('模块已加载:', extDemo);
    </script>
</body>
</html>
```

### 2. ES6 模块导入

```javascript
// 动态导入
import('http://localhost:3000/index.umd.js')
    .then(module => {
        console.log('模块已加载:', module);
    });
```

### 3. 在 Vue 项目中使用

```javascript
// main.js
import Vue from 'vue'
import App from './App.vue'

// 加载外部 UMD 模块
const script = document.createElement('script');
script.src = 'http://localhost:3000/index.umd.js';
script.onload = () => {
    // 模块加载完成后启动 Vue 应用
    new Vue({
        render: h => h(App),
    }).$mount('#app');
};
document.head.appendChild(script);
```

## 🔧 配置选项

### 端口配置

默认端口为 3000，可以通过以下方式修改：

```bash
# 方法1：使用启动脚本
./start-server.sh 8080

# 方法2：直接使用 serve
npx serve --cors dist -p 8080
```

### CORS 配置

服务器默认启用了 CORS 支持，允许跨域访问。如果需要禁用 CORS：

```bash
npx serve dist -p 3000  # 不使用 --cors 参数
```

## 🛠️ 构建和部署

### 1. 构建 UMD 文件

```bash
# 进入项目目录
cd examples/ext-demo

# 构建项目
npm run build
```

### 2. 监听模式（开发时）

```bash
# 同时启动构建监听和服务器
npm run watch-and-serve
```

## 📊 服务器状态检查

### 检查服务器是否启动

```bash
curl -I http://localhost:3000
```

### 检查 UMD 文件是否可访问

```bash
curl -I http://localhost:3000/index.umd.js
```

## 🐛 常见问题

### 1. 服务器启动失败

**问题**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**:
```bash
# 检查端口占用
lsof -ti:3000

# 杀死占用进程
kill -9 $(lsof -ti:3000)

# 或使用其他端口
./start-server.sh 3001
```

### 2. 模块加载失败

**可能原因**:
- UMD 文件路径不正确
- 服务器未启动
- CORS 问题

**解决方案**:
1. 检查文件是否存在: `ls dist/index.umd.js`
2. 确认服务器运行: `curl -I http://localhost:3000`
3. 使用 `--cors` 参数启动服务器

### 3. 模块找不到

**问题**: `window['ext-demo_1751967884260'] is undefined`

**解决方案**:
1. 确认 UMD 文件已正确加载
2. 检查浏览器控制台是否有错误
3. 确认模块标识符是否正确

## 📚 相关命令

```bash
# 开发相关
npm run build          # 构建项目
npm run build:watch    # 监听模式构建
npm run serve-dist     # 启动静态服务器
npm run watch-and-serve # 同时启动监听和服务器

# 服务器相关
./start-server.sh      # 启动服务器（推荐）
./start-server.sh 8080 # 指定端口启动
```

## 🔗 相关链接

- [项目 README](README.md)
- [Vue.js 官方文档](https://vuejs.org/)
- [serve 包文档](https://github.com/vercel/serve)
