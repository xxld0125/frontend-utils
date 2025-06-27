<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">Frontend Utils 功能验证平台</h1>
      <p style="font-size: 16px; line-height: 1.8; color: #6b7280; margin-bottom: 24px;">
        这是一个专门用于验证 <code>@frontendUtils/load-script</code> 功能的可视化平台，
        您可以通过不同的测试页面验证动态加载、沙箱隔离等核心功能。
      </p>
      
      <div class="grid grid-2">
        <!-- Load Script 测试 -->
        <div class="card">
          <h2 class="card-title">🚀 Load Script 动态加载测试</h2>
          <p style="margin-bottom: 16px; color: #6b7280;">
            测试 UMD 脚本的动态加载功能，支持多种流行的 JavaScript 库：
          </p>
          <ul style="margin-bottom: 16px; padding-left: 20px; color: #6b7280;">
            <li>Lodash - 实用工具库</li>
            <li>Day.js - 日期处理库</li>
            <li>Chart.js - 图表库</li>
            <li>Vue 3 - 框架库</li>
          </ul>
          <router-link to="/load-script" class="btn btn-primary">
            开始测试 →
          </router-link>
        </div>

        <!-- 沙箱隔离测试 -->
        <div class="card">
          <h2 class="card-title">🛡️ 沙箱隔离测试</h2>
          <p style="margin-bottom: 16px; color: #6b7280;">
            验证沙箱隔离机制的有效性，确保脚本执行不会污染全局环境：
          </p>
          <ul style="margin-bottom: 16px; padding-left: 20px; color: #6b7280;">
            <li>全局变量隔离</li>
            <li>函数绑定测试</li>
            <li>环境变量监控</li>
            <li>冲突避免验证</li>
          </ul>
          <router-link to="/sandbox" class="btn btn-success">
            沙箱测试 →
          </router-link>
        </div>
      </div>

      <!-- 性能测试 -->
      <div class="card">
        <h2 class="card-title">⚡ 性能测试</h2>
        <p style="margin-bottom: 16px; color: #6b7280;">
          测试脚本加载性能、缓存机制和内存使用情况：
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <span style="background: #e5f3ff; color: #0066cc; padding: 4px 8px; border-radius: 4px; font-size: 14px;">加载时间测试</span>
          <span style="background: #f0f9e8; color: #22c55e; padding: 4px 8px; border-radius: 4px; font-size: 14px;">缓存效果验证</span>
          <span style="background: #fef3e2; color: #f59e0b; padding: 4px 8px; border-radius: 4px; font-size: 14px;">内存占用监控</span>
        </div>
        <div style="margin-top: 16px;">
          <router-link to="/performance" class="btn btn-warning">
            性能测试 →
          </router-link>
        </div>
      </div>
    </div>

    <!-- 核心特性介绍 -->
    <div class="card">
      <h2 class="card-title">🎯 核心特性</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">🔐 沙箱隔离</h3>
          <p style="color: #6b7280; font-size: 14px;">
            基于 Proxy 的完整沙箱机制，确保脚本在安全隔离环境中执行
          </p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">📦 UMD 支持</h3>
          <p style="color: #6b7280; font-size: 14px;">
            专门支持 UMD 格式脚本，兼容 CommonJS、AMD 和浏览器全局变量
          </p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">⚡ 智能缓存</h3>
          <p style="color: #6b7280; font-size: 14px;">
            避免重复加载相同脚本，提升性能和用户体验
          </p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">🔧 函数绑定</h3>
          <p style="color: #6b7280; font-size: 14px;">
            自动处理函数上下文绑定，确保正确的执行环境
          </p>
        </div>
      </div>
    </div>

    <!-- 使用指南 -->
    <div class="card">
      <h2 class="card-title">📖 使用指南</h2>
      <div class="code-block">
// 基本用法
import { loadScript } from '@frontendUtils/load-script'

// 加载 Lodash
const _ = await loadScript('https://unpkg.com/lodash@4.17.21/lodash.min.js')
console.log(_.chunk([1, 2, 3, 4, 5, 6], 2)) // [[1, 2], [3, 4], [5, 6]]

// 加载 Day.js
const dayjs = await loadScript('https://unpkg.com/dayjs@1.11.10/dayjs.min.js')
console.log(dayjs().format('YYYY-MM-DD'))
      </div>
    </div>
  </div>
</template>

<script setup>
// 首页不需要特殊逻辑
</script> 