# Backend API 示例

这是一个基于 Express.js 的后端API服务示例项目。

## 功能特性

- ✅ Express.js 服务器
- ✅ CORS 支持
- ✅ 安全中间件 (Helmet)
- ✅ 环境变量配置
- ✅ ESLint 代码规范
- ✅ 开发热重载 (Nodemon)

## 快速开始

### 安装依赖

```bash
npm install
```

### 环境配置

复制环境变量示例文件并根据需要修改：

```bash
cp .env.example .env
```

### 开发模式

```bash
npm run dev
```

服务器将在 `http://localhost:3000` 启动，并支持热重载。

### 生产模式

```bash
npm start
```

## API 接口

### GET /

返回欢迎消息。

**响应示例：**

```json
{
  "message": "Hello World!",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /ext-list

获取扩展列表（示例接口）。

**响应示例：**

```json
{
  "data": [],
  "message": "获取扩展列表成功"
}
```

## 可用脚本

- `npm start` - 启动生产服务器
- `npm run dev` - 启动开发服务器（支持热重载）
- `npm run lint` - 检查代码规范
- `npm run lint:fix` - 自动修复代码规范问题

## 项目结构

```
backend/
├── src/
│   └── index.js          # 主服务器文件
├── .env.example          # 环境变量示例
├── .gitignore           # Git忽略文件
├── eslint.config.js     # ESLint配置
├── package.json         # 项目配置
└── README.md           # 项目说明
```

## 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

## 许可证

ISC
