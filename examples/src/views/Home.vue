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

      <!-- CDN Core 测试 -->
      <div class="card">
        <h2 class="card-title">🚀 CDN Core 核心测试</h2>
        <p style="margin-bottom: 16px; color: #6b7280;">
          测试 CDN 核心功能包的高级特性，包括配置管理、网络请求和重试机制：
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <span style="background: #f3e8ff; color: #8b5cf6; padding: 4px 8px; border-radius: 4px; font-size: 14px;">配置管理</span>
          <span style="background: #ecfdf5; color: #059669; padding: 4px 8px; border-radius: 4px; font-size: 14px;">网络请求</span>
          <span style="background: #fef2f2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 14px;">重试机制</span>
          <span style="background: #f0f9ff; color: #2563eb; padding: 4px 8px; border-radius: 4px; font-size: 14px;">错误处理</span>
        </div>
        <div style="margin-top: 16px;">
          <router-link to="/cdn-core" class="btn btn-primary">
            CDN Core 测试 →
          </router-link>
        </div>
      </div>

      <!-- CDN Vue2 测试 -->
      <div class="card">
        <h2 class="card-title">🎯 CDN Vue2 组件测试</h2>
        <p style="margin-bottom: 16px; color: #6b7280;">
          测试 Vue 2 动态组件加载功能，验证远程Vue组件的加载、渲染和交互：
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <span style="background: #e7f5e7; color: #2d5f2d; padding: 4px 8px; border-radius: 4px; font-size: 14px;">组件加载</span>
          <span style="background: #fff7ed; color: #c2410c; padding: 4px 8px; border-radius: 4px; font-size: 14px;">属性传递</span>
          <span style="background: #fef3f2; color: #991b1b; padding: 4px 8px; border-radius: 4px; font-size: 14px;">事件处理</span>
          <span style="background: #f0f4ff; color: #3730a3; padding: 4px 8px; border-radius: 4px; font-size: 14px;">生命周期</span>
        </div>
        <div style="margin-top: 16px;">
          <router-link to="/cdn-vue2" class="btn btn-success">
            CDN Vue2 测试 →
          </router-link>
        </div>
      </div>

      <!-- Ext Core 测试 -->
      <div class="card">
        <h2 class="card-title">🔌 Ext Core 扩展点测试</h2>
        <p style="margin-bottom: 16px; color: #6b7280;">
          测试前端扩展点核心库功能，包括动态扩展点管理、条件匹配和智能缓存：
        </p>
        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <span style="background: #f3e8ff; color: #7c3aed; padding: 4px 8px; border-radius: 4px; font-size: 14px;">扩展点管理</span>
          <span style="background: #ecfdf5; color: #047857; padding: 4px 8px; border-radius: 4px; font-size: 14px;">条件匹配</span>
          <span style="background: #fef3f2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 14px;">错误处理</span>
          <span style="background: #f0f9ff; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 14px;">智能缓存</span>
        </div>
        <div style="margin-top: 16px;">
          <router-link to="/ext-core" class="btn btn-primary">
            Ext Core 测试 →
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
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">🌐 网络请求</h3>
          <p style="color: #6b7280; font-size: 14px;">
            提供 GET/POST 请求和远程内容获取功能，支持参数传递
          </p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">🔄 智能重试</h3>
          <p style="color: #6b7280; font-size: 14px;">
            内置多级重试机制，自动处理网络异常和临时失败
          </p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">🎯 Vue2 组件</h3>
          <p style="color: #6b7280; font-size: 14px;">
            专为Vue 2设计的动态组件加载器，支持属性传递和事件绑定
          </p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">🔧 配置灵活</h3>
          <p style="color: #6b7280; font-size: 14px;">
            支持自定义加载状态、错误处理和全局配置管理
          </p>
        </div>
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="color: #1f2937; margin-bottom: 8px;">🔌 扩展点系统</h3>
          <p style="color: #6b7280; font-size: 14px;">
            动态扩展点管理，支持条件匹配、远程加载和智能缓存
          </p>
        </div>
      </div>
    </div>

    <!-- 使用指南 -->
    <div class="card">
      <h2 class="card-title">📖 使用指南</h2>
      <div class="grid grid-2">
        <div>
          <h3 style="margin-bottom: 12px;">Load Script 基础用法</h3>
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
        <div>
          <h3 style="margin-bottom: 12px;">CDN Core 高级用法</h3>
          <div class="code-block">
// CDN Core 用法
import { loadScript, setCdnConfig, getData } from '@frontendUtils/cdn-core'

// 配置 CDN 基础路径
setCdnConfig({
  baseURL: 'https://unpkg.com',
  errorHandler: (error) => console.error('CDN 错误:', error)
})

// 基于配置加载脚本
const _ = await loadScript('/lodash@4.17.21/lodash.min.js')

// 网络请求
const data = await getData('https://api.example.com/data')
          </div>
        </div>
      </div>

      <div class="grid grid-2">
        <div>
          <h3 style="margin-bottom: 12px;">CDN Vue2 组件用法</h3>
          <div class="code-block">
// Vue 2 项目中使用
import { CdnComponent, startCdnComponent } from '@frontendUtils/cdn-vue2'

// 全局配置
startCdnComponent({
  baseURL: 'https://unpkg.com',
  errorFallback: '组件加载失败',
  loadingFallback: '正在加载组件...'
})

// 注册全局组件
Vue.component('CdnComponent', CdnComponent)
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">Vue 模板中使用</h3>
          <div class="code-block">
&lt;template&gt;
  &lt;div&gt;
    &lt;!-- 动态加载远程组件 --&gt;
    &lt;CdnComponent
      url="/my-component@1.0.0/dist/component.umd.js"
      export-name="MyComponent"
      :com-props="{ title: '动态组件', data: userData }"
      :com-events="{ click: handleClick, change: handleChange }"
      @loading="onLoading"
      @error="onError"
    &gt;
      &lt;!-- 默认插槽内容 --&gt;
      &lt;div&gt;组件内容&lt;/div&gt;
    &lt;/CdnComponent&gt;
  &lt;/div&gt;
&lt;/template&gt;
          </div>
        </div>
      </div>

      <div class="grid grid-2">
        <div>
          <h3 style="margin-bottom: 12px;">Ext Core 扩展点用法</h3>
          <div class="code-block">
// 初始化扩展点系统
import { startExtCore } from '@frontendUtils/ext-core'

startExtCore({
  appGroup: 'your-app-group',
  appName: 'your-app-name',
  devUseTestApi: true,
  errorHandler: console.error
})

// 配置环境变量
window.ENVIRONMENT_EXT = {
  env: 'dev',
  'ares-ext': 'https://api.example.com/ext',
  'jarvis-node-id': 'your-node-id'
}
          </div>
        </div>
        <div>
          <h3 style="margin-bottom: 12px;">创建和使用扩展点</h3>
          <div class="code-block">
// 创建扩展点
import { extJs } from '@frontendUtils/ext-core'

const dataProcessor = extJs({
  name: 'data-processor',
  checker: conditions => conditions.userRole === 'admin',
  blockOnError: false,
  exportName: 'processData',
  originFn: data => ({ ...data, processed: true })
})

// 使用扩展点
const result = await dataProcessor({ id: 1, name: 'test' })
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 首页不需要特殊逻辑
</script>
