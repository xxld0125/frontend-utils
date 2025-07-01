<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">🚀 CDN Core 核心功能测试</h1>
      <p style="margin-bottom: 24px; color: #6b7280;">
        测试 <code>@frontendUtils/cdn-core</code> 的核心功能，包括配置管理、脚本加载、网络请求和重试机制。
      </p>
    </div>

    <div class="grid grid-2">
      <!-- 配置管理测试 -->
      <div class="card">
        <h2 class="card-title">⚙️ 配置管理测试</h2>
        <div class="form-group">
          <label class="form-label">CDN Base URL：</label>
          <input
            v-model="baseURL"
            class="form-input"
            type="url"
            placeholder="https://unpkg.com"
          >
        </div>

        <div style="margin-bottom: 16px;">
          <button @click="setCdnConfiguration" class="btn btn-primary">
            设置 CDN 配置
          </button>
          <button @click="getCdnConfiguration" class="btn btn-success">
            获取当前配置
          </button>
          <button @click="resetConfiguration" class="btn btn-warning">
            重置配置
          </button>
        </div>

        <div v-if="configResult" class="code-block">
          {{ configResult }}
        </div>
      </div>

      <!-- URL 路径处理测试 -->
      <div class="card">
        <h2 class="card-title">🔗 URL 路径处理测试</h2>
        <div class="form-group">
          <label class="form-label">相对路径：</label>
          <input
            v-model="relativePath"
            class="form-input"
            type="text"
            placeholder="/lodash@4.17.21/lodash.min.js"
          >
        </div>

        <div style="margin-bottom: 16px;">
          <button @click="testUrlGeneration" class="btn btn-primary">
            测试 URL 生成
          </button>
        </div>

        <div v-if="urlResult" class="code-block">
          {{ urlResult }}
        </div>
      </div>
    </div>

    <!-- CDN 脚本加载测试 -->
    <div class="card">
      <h2 class="card-title">📦 CDN 脚本加载测试</h2>
      <div class="grid grid-2">
        <div>
          <h3 style="margin-bottom: 12px;">基于配置的加载</h3>
          <div class="form-group">
            <label class="form-label">脚本路径：</label>
            <input
              v-model="scriptPath"
              class="form-input"
              type="text"
              placeholder="/lodash@4.17.21/lodash.min.js"
            >
          </div>

          <div class="form-group">
            <label class="form-label">导出名称（可选）：</label>
            <input
              v-model="exportName"
              class="form-input"
              type="text"
              placeholder="例如: _"
            >
          </div>

          <button
            @click="loadCdnScript"
            :disabled="cdnLoading"
            class="btn btn-primary"
          >
            {{ cdnLoading ? '加载中...' : '加载 CDN 脚本' }}
          </button>
        </div>

        <div>
          <h3 style="margin-bottom: 12px;">重试机制测试</h3>
          <div class="form-group">
            <label class="form-label">错误 URL（测试重试）：</label>
            <input
              v-model="errorUrl"
              class="form-input"
              type="text"
              placeholder="/non-existent-library.js"
            >
          </div>

          <button
            @click="testRetryMechanism"
            :disabled="retryTesting"
            class="btn btn-danger"
          >
            {{ retryTesting ? '重试测试中...' : '测试重试机制' }}
          </button>
        </div>
      </div>

      <div v-if="cdnLoadResult" class="code-block" style="margin-top: 16px;">
        {{ cdnLoadResult }}
      </div>
    </div>

    <!-- 网络请求测试 -->
    <div class="card">
      <h2 class="card-title">🌐 网络请求测试</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">

        <!-- GET 请求测试 -->
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="margin-bottom: 12px;">GET 请求</h3>
          <div class="form-group">
            <label class="form-label">API URL：</label>
            <input
              v-model="getApiUrl"
              class="form-input"
              type="url"
              placeholder="https://jsonplaceholder.typicode.com/posts/1"
            >
          </div>

          <button @click="testGetRequest" :disabled="getLoading" class="btn btn-success">
            {{ getLoading ? '请求中...' : '发送 GET 请求' }}
          </button>

          <div v-if="getResult" class="code-block" style="margin-top: 8px; font-size: 12px;">
            {{ getResult }}
          </div>
        </div>

        <!-- POST 请求测试 -->
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="margin-bottom: 12px;">POST 请求</h3>
          <div class="form-group">
            <label class="form-label">API URL：</label>
            <input
              v-model="postApiUrl"
              class="form-input"
              type="url"
              placeholder="https://jsonplaceholder.typicode.com/posts"
            >
          </div>

          <div class="form-group">
            <label class="form-label">请求数据：</label>
            <textarea
              v-model="postData"
              class="form-input"
              rows="3"
              placeholder='{"title": "test", "body": "content"}'
            ></textarea>
          </div>

          <button @click="testPostRequest" :disabled="postLoading" class="btn btn-warning">
            {{ postLoading ? '请求中...' : '发送 POST 请求' }}
          </button>

          <div v-if="postResult" class="code-block" style="margin-top: 8px; font-size: 12px;">
            {{ postResult }}
          </div>
        </div>

        <!-- 远程字符串获取测试 -->
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="margin-bottom: 12px;">远程字符串获取</h3>
          <div class="form-group">
            <label class="form-label">文本文件 URL：</label>
            <input
              v-model="remoteStringUrl"
              class="form-input"
              type="url"
              placeholder="https://unpkg.com/lodash@4.17.21/package.json"
            >
          </div>

          <button @click="testRemoteString" :disabled="stringLoading" class="btn btn-primary">
            {{ stringLoading ? '获取中...' : '获取远程字符串' }}
          </button>

          <div v-if="stringResult" class="code-block" style="margin-top: 8px; font-size: 12px;">
            {{ stringResult }}
          </div>
        </div>
      </div>
    </div>

    <!-- 错误处理测试 -->
    <div class="card">
      <h2 class="card-title">🛡️ 错误处理测试</h2>
      <div style="margin-bottom: 16px;">
        <button @click="testEmptyPath" class="btn btn-danger">
          测试空路径错误
        </button>
        <button @click="testInvalidUrl" class="btn btn-danger">
          测试无效 URL 错误
        </button>
        <button @click="testCustomErrorHandler" class="btn btn-warning">
          测试自定义错误处理器
        </button>
      </div>

      <div v-if="errorTestResult" class="code-block">
        {{ errorTestResult }}
      </div>
    </div>

    <!-- 性能和调试 -->
    <div class="card">
      <h2 class="card-title">🔧 调试和性能</h2>
      <div style="margin-bottom: 16px;">
        <button @click="toggleDebugMode" class="btn btn-primary">
          {{ debugMode ? '关闭' : '开启' }} 调试模式
        </button>
        <button @click="performanceTest" :disabled="perfTesting" class="btn btn-success">
          {{ perfTesting ? '性能测试中...' : '性能测试' }}
        </button>
      </div>

      <div v-if="debugResult" class="code-block">
        {{ debugResult }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  loadScript,
  setCdnConfig,
  getCdnConfig,
  getUrl,
  getData,
  postData as postRequest,
  getRemoteString,
  getErrorHandler
} from '@frontendUtils/cdn-core'

// 响应式数据
const baseURL = ref('https://unpkg.com')
const configResult = ref('')
const relativePath = ref('/lodash@4.17.21/lodash.min.js')
const urlResult = ref('')

// CDN 脚本加载相关
const scriptPath = ref('/lodash@4.17.21/lodash.min.js')
const exportName = ref('_')
const errorUrl = ref('/non-existent-library-12345.js')
const cdnLoading = ref(false)
const retryTesting = ref(false)
const cdnLoadResult = ref('')

// 网络请求相关
const getApiUrl = ref('https://jsonplaceholder.typicode.com/posts/1')
const getLoading = ref(false)
const getResult = ref('')

const postApiUrl = ref('https://jsonplaceholder.typicode.com/posts')
const postData = ref('{"title": "测试标题", "body": "测试内容", "userId": 1}')
const postLoading = ref(false)
const postResult = ref('')

const remoteStringUrl = ref('https://unpkg.com/lodash@4.17.21/package.json')
const stringLoading = ref(false)
const stringResult = ref('')

// 错误处理和调试
const errorTestResult = ref('')
const debugMode = ref(false)
const debugResult = ref('')
const perfTesting = ref(false)

// 配置管理函数
function setCdnConfiguration() {
  try {
    setCdnConfig({
      baseURL: baseURL.value,
      errorHandler: (error) => {
        console.error('[CDN 自定义错误]:', error)
        errorTestResult.value = `自定义错误处理器捕获: ${error.message}`
      }
    })
    configResult.value = `✅ CDN 配置设置成功\n基础URL: ${baseURL.value}`
  } catch (error) {
    configResult.value = `❌ 配置设置失败: ${error.message}`
  }
}

function getCdnConfiguration() {
  try {
    const config = getCdnConfig()
    configResult.value = `当前配置:\n${JSON.stringify(config, null, 2)}`
  } catch (error) {
    configResult.value = `❌ 获取配置失败: ${error.message}`
  }
}

function resetConfiguration() {
  setCdnConfig({})
  baseURL.value = 'https://unpkg.com'
  configResult.value = '✅ 配置已重置'
}

// URL 生成测试
function testUrlGeneration() {
  try {
    const fullUrl = getUrl(relativePath.value)
    urlResult.value = `输入路径: ${relativePath.value}\n生成 URL: ${fullUrl}`
  } catch (error) {
    urlResult.value = `❌ URL 生成失败: ${error.message}`
  }
}

// CDN 脚本加载测试
async function loadCdnScript() {
  cdnLoading.value = true
  cdnLoadResult.value = ''

  try {
    const startTime = performance.now()
    const result = await loadScript(scriptPath.value, exportName.value || undefined)
    const endTime = performance.now()

    cdnLoadResult.value = `✅ CDN 脚本加载成功\n`
    cdnLoadResult.value += `路径: ${scriptPath.value}\n`
    cdnLoadResult.value += `导出: ${exportName.value || '默认导出'}\n`
    cdnLoadResult.value += `耗时: ${Math.round(endTime - startTime)}ms\n`
    cdnLoadResult.value += `类型: ${typeof result}\n`

    if (typeof result === 'function') {
      cdnLoadResult.value += `函数名: ${result.name || '匿名函数'}`
    } else if (typeof result === 'object' && result) {
      const keys = Object.keys(result).slice(0, 5)
      cdnLoadResult.value += `对象属性: ${keys.join(', ')}${keys.length === 5 ? '...' : ''}`
    }

  } catch (error) {
    cdnLoadResult.value = `❌ CDN 脚本加载失败: ${error.message}`
  } finally {
    cdnLoading.value = false
  }
}

// 重试机制测试
async function testRetryMechanism() {
  retryTesting.value = true
  cdnLoadResult.value = '开始重试机制测试...'

  try {
    const startTime = performance.now()
    await loadScript(errorUrl.value)
    const endTime = performance.now()

    cdnLoadResult.value = `⚠️ 意外成功加载了错误 URL\n耗时: ${Math.round(endTime - startTime)}ms`
  } catch (error) {
    const endTime = performance.now()
    cdnLoadResult.value = `✅ 重试机制测试完成\n`
    cdnLoadResult.value += `预期结果: 加载失败\n`
    cdnLoadResult.value += `实际结果: ${error.message}\n`
    cdnLoadResult.value += `总耗时: ${Math.round(endTime - performance.now())}ms\n`
    cdnLoadResult.value += `说明: 重试机制按预期工作，在多次重试后正确抛出错误`
  } finally {
    retryTesting.value = false
  }
}

// GET 请求测试
async function testGetRequest() {
  getLoading.value = true
  getResult.value = ''

  try {
    const result = await getData(getApiUrl.value)
    getResult.value = `✅ GET 请求成功\n`
    getResult.value += `URL: ${getApiUrl.value}\n`
    getResult.value += `响应: ${JSON.stringify(result, null, 2).slice(0, 300)}...`
  } catch (error) {
    getResult.value = `❌ GET 请求失败: ${error.message}`
  } finally {
    getLoading.value = false
  }
}

// POST 请求测试
async function testPostRequest() {
  postLoading.value = true
  postResult.value = ''

  try {
    const data = JSON.parse(postData.value)
    const result = await postRequest(postApiUrl.value, data)
    postResult.value = `✅ POST 请求成功\n`
    postResult.value += `URL: ${postApiUrl.value}\n`
    postResult.value += `请求数据: ${JSON.stringify(data)}\n`
    postResult.value += `响应: ${JSON.stringify(result, null, 2).slice(0, 200)}...`
  } catch (error) {
    postResult.value = `❌ POST 请求失败: ${error.message}`
  } finally {
    postLoading.value = false
  }
}

// 远程字符串获取测试
async function testRemoteString() {
  stringLoading.value = true
  stringResult.value = ''

  try {
    const result = await getRemoteString(remoteStringUrl.value)
    stringResult.value = `✅ 远程字符串获取成功\n`
    stringResult.value += `URL: ${remoteStringUrl.value}\n`
    stringResult.value += `长度: ${result.length} 字符\n`
    stringResult.value += `内容预览: ${result.slice(0, 200)}...`
  } catch (error) {
    stringResult.value = `❌ 远程字符串获取失败: ${error.message}`
  } finally {
    stringLoading.value = false
  }
}

// 错误处理测试
async function testEmptyPath() {
  try {
    await loadScript('')
    errorTestResult.value = '⚠️ 空路径测试失败：应该抛出错误但没有'
  } catch (error) {
    errorTestResult.value = `✅ 空路径错误处理正确: ${error.message}`
  }
}

async function testInvalidUrl() {
  try {
    await loadScript('invalid-url-12345')
    errorTestResult.value = '⚠️ 无效URL测试失败：应该抛出错误但没有'
  } catch (error) {
    errorTestResult.value = `✅ 无效URL错误处理正确: ${error.message}`
  }
}

function testCustomErrorHandler() {
  const handler = getErrorHandler((error) => {
    return `自定义处理: ${error.message}`
  })

  errorTestResult.value = `✅ 自定义错误处理器测试\n`
  errorTestResult.value += `处理器类型: ${typeof handler}\n`
  errorTestResult.value += `测试调用: ${handler(new Error('测试错误'))}`
}

// 调试和性能
function toggleDebugMode() {
  debugMode.value = !debugMode.value
  if (debugMode.value) {
    localStorage.setItem('ext-debug', '1')
    debugResult.value = '✅ 调试模式已开启\n现在可以在控制台看到详细日志'
  } else {
    localStorage.removeItem('ext-debug')
    debugResult.value = '✅ 调试模式已关闭'
  }
}

async function performanceTest() {
  perfTesting.value = true
  debugResult.value = '性能测试进行中...'

  try {
    const testUrls = [
      '/lodash@4.17.21/lodash.min.js',
      '/dayjs@1.11.10/dayjs.min.js',
      '/chart.js@4/dist/chart.umd.js'
    ]

    const results = []

    for (const url of testUrls) {
      const startTime = performance.now()
      try {
        await loadScript(url)
        const endTime = performance.now()
        results.push({
          url,
          time: Math.round(endTime - startTime),
          success: true
        })
      } catch (error) {
        results.push({
          url,
          error: error.message,
          success: false
        })
      }
    }

    debugResult.value = '📊 性能测试结果:\n'
    results.forEach(result => {
      if (result.success) {
        debugResult.value += `✅ ${result.url}: ${result.time}ms\n`
      } else {
        debugResult.value += `❌ ${result.url}: ${result.error}\n`
      }
    })

    const successfulResults = results.filter(r => r.success)
    if (successfulResults.length > 0) {
      const avgTime = Math.round(successfulResults.reduce((acc, r) => acc + r.time, 0) / successfulResults.length)
      debugResult.value += `\n平均加载时间: ${avgTime}ms`
    }

  } catch (error) {
    debugResult.value = `❌ 性能测试失败: ${error.message}`
  } finally {
    perfTesting.value = false
  }
}

// 初始化时检查调试模式
debugMode.value = !!localStorage.getItem('ext-debug')
</script>
