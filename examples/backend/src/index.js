import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

// 获取当前文件的目录路径（ES模块兼容）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 加载环境变量
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

const examplesDir = path.join(__dirname, '../../../examples');
const subdirs = fs.readdirSync(examplesDir).filter(name => {
  const fullPath = path.join(examplesDir, name);
  return fs.statSync(fullPath).isDirectory();
});

const extConfig = subdirs.filter(folderName => folderName.startsWith('ext-'));

// 静态文件服务 - 提供扩展点JS文件访问
extConfig.map(folderName => {
  app.use(`/static/${folderName}`, express.static(path.join(__dirname, `../../../examples/${folderName}/dist`)));
})

// 解析JSON请求体
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// 主页路由
app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!',
    service: 'Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 扩展列表路由
app.post('/ext-list', (req, res) => {
  try {
    // 获取当前服务器的基础URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const extensions = extConfig.map((folderName) => {
      return {
        condition: {
          code: 'test',
        },
        type: 2,
        interface_method: folderName,
        extension_point_url: `${baseUrl}/static/${folderName}/index.umd.js`
      }
    })

    res.json({
      success: true,
      message: '获取扩展列表成功',
      list: extensions,
      total: extensions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取扩展列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : '内部服务器错误',
      timestamp: new Date().toISOString()
    });
  }
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// 全局错误处理中间件
app.use((error, req, res, _next) => {
  console.error('全局错误:', error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || '内部服务器错误',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 服务器运行在端口 ${port}`);
  console.log(`🌍 环境: ${process.env.NODE_ENV || 'development'}`);
});
