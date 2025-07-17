#!/bin/bash

# Ext Demo 本地服务器启动脚本
# 用于部署 index.umd.js 到本地服务器

echo "🚀 启动 Ext Demo 本地服务器..."

# 检查 dist 目录是否存在
if [ ! -d "dist" ]; then
    echo "❌ dist 目录不存在，请先运行构建命令: npm run build"
    exit 1
fi

# 检查 index.umd.js 文件是否存在
if [ ! -f "dist/index.umd.js" ]; then
    echo "❌ index.umd.js 文件不存在，请先运行构建命令: npm run build"
    exit 1
fi

# 获取可用端口（默认 3000）
PORT=${1:-3000}

echo "📁 服务目录: $(pwd)/dist"
echo "🌐 访问地址: http://localhost:$PORT"
echo "📦 UMD 文件: http://localhost:$PORT/index.umd.js"
echo "🧪 测试页面: http://localhost:$PORT/demo.html"
echo ""
echo "按 Ctrl+C 停止服务器"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 启动服务器
npx serve --cors dist -p $PORT
