<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">🚀 Load Script 动态加载测试</h1>
      <p style="margin-bottom: 24px; color: #6b7280;">
        测试 <code>@frontendUtils/load-script</code> 的动态加载功能，验证各种流行 UMD 库的加载效果。
      </p>
    </div>

    <div class="grid grid-2">
      <!-- 预设脚本测试 -->
      <div class="card">
        <h2 class="card-title">📦 预设脚本测试</h2>
        <p style="margin-bottom: 16px; color: #6b7280;">
          点击按钮测试常用库的加载效果：
        </p>
        
        <div style="margin-bottom: 16px;">
          <button 
            v-for="script in presetScripts" 
            :key="script.name"
            @click="loadPresetScript(script)"
            :disabled="loading"
            class="btn btn-primary"
          >
            {{ loading && currentScript === script.name ? '加载中...' : `加载 ${script.name}` }}
          </button>
        </div>

        <!-- 结果展示 -->
        <div v-if="loadResult" class="code-block">
          <strong>{{ loadResult.name }} 加载结果：</strong><br>
          {{ loadResult.result }}
        </div>

        <div v-if="loadError" class="code-block" style="background-color: #fef2f2; border-color: #fecaca; color: #dc2626;">
          <strong>❌ 加载失败：</strong><br>
          {{ loadError }}
        </div>
      </div>

      <!-- 自定义脚本测试 -->
      <div class="card">
        <h2 class="card-title">🔧 自定义脚本测试</h2>
        <p style="margin-bottom: 16px; color: #6b7280;">
          输入自定义 UMD 脚本 URL 进行测试：
        </p>
        
        <div class="form-group">
          <label class="form-label">脚本 URL：</label>
          <input 
            v-model="customUrl"
            class="form-input"
            type="url"
            placeholder="https://unpkg.com/library@version/dist/library.umd.js"
          >
        </div>

        <div class="form-group">
          <label class="form-label">预期导出变量名（可选）：</label>
          <input 
            v-model="expectedVarName"
            class="form-input"
            type="text"
            placeholder="例如: _, dayjs, Chart"
          >
        </div>

        <button 
          @click="loadCustomScript"
          :disabled="loading || !customUrl"
          class="btn btn-success"
        >
          {{ loading && currentScript === 'custom' ? '加载中...' : '加载自定义脚本' }}
        </button>

        <!-- 自定义脚本结果 -->
        <div v-if="customResult" class="code-block" style="margin-top: 16px;">
          <strong>自定义脚本加载结果：</strong><br>
          {{ customResult }}
        </div>
      </div>
    </div>

    <!-- 全局环境监控 -->
    <div class="card">
      <h2 class="card-title">🌍 全局环境监控</h2>
      <p style="margin-bottom: 16px; color: #6b7280;">
        监控脚本加载前后全局 window 对象的变化，验证沙箱隔离效果：
      </p>
      
      <div style="display: flex; gap: 12px; margin-bottom: 16px;">
        <button @click="captureGlobalBefore" class="btn btn-warning">
          📸 记录加载前状态
        </button>
        <button @click="captureGlobalAfter" class="btn btn-warning">
          📸 记录加载后状态
        </button>
        <button @click="compareGlobal" class="btn btn-primary">
          🔍 对比变化
        </button>
      </div>

      <div v-if="globalComparison" class="code-block">
        <strong>全局变量变化对比：</strong><br>
        {{ globalComparison }}
      </div>
    </div>

    <!-- 函数功能测试 -->
    <div class="card" v-if="loadedLibraries.length > 0">
      <h2 class="card-title">🎯 函数功能测试</h2>
      <p style="margin-bottom: 16px; color: #6b7280;">
        测试已加载库的核心功能：
      </p>
      
      <div v-for="lib in loadedLibraries" :key="lib.name" style="margin-bottom: 20px; padding: 16px; border: 1px solid #e5e7eb; border-radius: 6px;">
        <h3 style="margin-bottom: 12px; color: #1f2937;">{{ lib.name }} 功能测试</h3>
        
        <!-- Lodash 测试 -->
        <div v-if="lib.name === 'Lodash'">
          <button @click="testLodash" class="btn btn-primary">测试 chunk 函数</button>
          <div v-if="lib.testResult" class="code-block" style="margin-top: 8px;">
            {{ lib.testResult }}
          </div>
        </div>

        <!-- Day.js 测试 -->
        <div v-if="lib.name === 'Day.js'">
          <button @click="testDayjs" class="btn btn-primary">测试日期格式化</button>
          <div v-if="lib.testResult" class="code-block" style="margin-top: 8px;">
            {{ lib.testResult }}
          </div>
        </div>

        <!-- Chart.js 测试 -->
        <div v-if="lib.name === 'Chart.js'">
          <button @click="testChartjs" class="btn btn-primary">验证 Chart 对象</button>
          <div v-if="lib.testResult" class="code-block" style="margin-top: 8px;">
            {{ lib.testResult }}
          </div>
        </div>

        <!-- Vue 3 测试 -->
        <div v-if="lib.name === 'Vue 3'">
          <button @click="testVue3" class="btn btn-primary">测试 createApp 函数</button>
          <div v-if="lib.testResult" class="code-block" style="margin-top: 8px;">
            {{ lib.testResult }}
          </div>
        </div>
      </div>
    </div>

    <!-- 加载历史 -->
    <div class="card" v-if="loadHistory.length > 0">
      <h2 class="card-title">📋 加载历史</h2>
      <table class="table">
        <thead>
          <tr>
            <th>时间</th>
            <th>脚本名称</th>
            <th>状态</th>
            <th>耗时</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in loadHistory" :key="record.id">
            <td>{{ record.timestamp }}</td>
            <td>{{ record.name }}</td>
            <td>
              <span :class="record.success ? 'status-success' : 'status-error'">
                {{ record.success ? '✅ 成功' : '❌ 失败' }}
              </span>
            </td>
            <td>{{ record.duration }}ms</td>
            <td style="word-break: break-all; max-width: 300px;">{{ record.url }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { loadScript } from '@frontendUtils/load-script'

// 响应式数据
const loading = ref(false)
const currentScript = ref('')
const loadResult = ref(null)
const loadError = ref('')
const customUrl = ref('')
const expectedVarName = ref('')
const customResult = ref('')
const globalBefore = ref(null)
const globalAfter = ref(null)
const globalComparison = ref('')
const loadedLibraries = ref([])
const loadHistory = ref([])

// 预设脚本配置
const presetScripts = [
  {
    name: 'Lodash',
    url: 'https://unpkg.com/lodash@4.17.21/lodash.min.js',
    testVar: '_'
  },
  {
    name: 'Day.js',
    url: 'https://unpkg.com/dayjs@1.11.10/dayjs.min.js',
    testVar: 'dayjs'
  },
  {
    name: 'Chart.js',
    url: 'https://unpkg.com/chart.js@4/dist/chart.umd.js',
    testVar: 'Chart'
  },
  {
    name: 'Vue 3',
    url: 'https://unpkg.com/vue@3/dist/vue.global.js',
    testVar: 'Vue'
  }
]

// 加载预设脚本
async function loadPresetScript(script) {
  await loadScriptWithTracking(script.url, script.name)
}

// 加载自定义脚本
async function loadCustomScript() {
  if (!customUrl.value) return
  
  const name = expectedVarName.value || '自定义脚本'
  await loadScriptWithTracking(customUrl.value, name, true)
}

// 通用脚本加载函数（带追踪）
async function loadScriptWithTracking(url, name, isCustom = false) {
  const startTime = Date.now()
  const recordId = Date.now() + Math.random()
  
  loading.value = true
  currentScript.value = isCustom ? 'custom' : name
  loadError.value = ''
  
  if (!isCustom) {
    loadResult.value = null
  } else {
    customResult.value = ''
  }

  try {
    console.log(`开始加载脚本: ${name}`)
    const result = await loadScript(url)
    const duration = Date.now() - startTime
    
    console.log(`脚本加载成功: ${name}`, result)
    
    // 记录成功结果
    const resultText = `类型: ${typeof result}, 构造函数: ${result?.constructor?.name || 'Unknown'}`
    
    if (!isCustom) {
      loadResult.value = {
        name,
        result: resultText
      }
      
      // 添加到已加载库列表
      const existingLib = loadedLibraries.value.find(lib => lib.name === name)
      if (!existingLib) {
        loadedLibraries.value.push({
          name,
          result,
          testResult: null
        })
      }
    } else {
      customResult.value = resultText
    }
    
    // 记录加载历史
    loadHistory.value.unshift({
      id: recordId,
      timestamp: new Date().toLocaleTimeString(),
      name,
      success: true,
      duration,
      url
    })
    
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`脚本加载失败: ${name}`, error)
    
    const errorMessage = error.message || '未知错误'
    
    if (!isCustom) {
      loadError.value = errorMessage
    } else {
      customResult.value = `❌ 加载失败: ${errorMessage}`
    }
    
    // 记录加载历史
    loadHistory.value.unshift({
      id: recordId,
      timestamp: new Date().toLocaleTimeString(),
      name,
      success: false,
      duration,
      url,
      error: errorMessage
    })
  } finally {
    loading.value = false
    currentScript.value = ''
  }
}

// 全局环境监控
function captureGlobalBefore() {
  globalBefore.value = Object.keys(window).length
  console.log('记录加载前全局变量数量:', globalBefore.value)
}

function captureGlobalAfter() {
  globalAfter.value = Object.keys(window).length
  console.log('记录加载后全局变量数量:', globalAfter.value)
}

function compareGlobal() {
  if (globalBefore.value !== null && globalAfter.value !== null) {
    const diff = globalAfter.value - globalBefore.value
    globalComparison.value = `加载前: ${globalBefore.value} 个全局变量\n加载后: ${globalAfter.value} 个全局变量\n变化: ${diff > 0 ? '+' : ''}${diff} 个变量`
    
    if (diff === 0) {
      globalComparison.value += '\n\n✅ 沙箱隔离成功！全局环境未被污染。'
    } else {
      globalComparison.value += '\n\n⚠️ 检测到全局变量变化，请检查沙箱隔离效果。'
    }
  } else {
    globalComparison.value = '请先记录加载前后的状态'
  }
}

// 功能测试函数
function testLodash() {
  const lib = loadedLibraries.value.find(lib => lib.name === 'Lodash')
  if (lib && lib.result) {
    try {
      const result = lib.result.chunk([1, 2, 3, 4, 5, 6], 2)
      lib.testResult = `_.chunk([1, 2, 3, 4, 5, 6], 2) = ${JSON.stringify(result)}`
    } catch (error) {
      lib.testResult = `测试失败: ${error.message}`
    }
  }
}

function testDayjs() {
  const lib = loadedLibraries.value.find(lib => lib.name === 'Day.js')
  if (lib && lib.result) {
    try {
      const result = lib.result().format('YYYY-MM-DD HH:mm:ss')
      lib.testResult = `当前时间: ${result}`
    } catch (error) {
      lib.testResult = `测试失败: ${error.message}`
    }
  }
}

function testChartjs() {
  const lib = loadedLibraries.value.find(lib => lib.name === 'Chart.js')
  if (lib && lib.result) {
    try {
      const hasRequired = typeof lib.result.register === 'function'
      lib.testResult = `Chart 对象验证: ${hasRequired ? '✅ 有效' : '❌ 无效'}\n可用方法: ${Object.getOwnPropertyNames(lib.result).slice(0, 5).join(', ')}...`
    } catch (error) {
      lib.testResult = `测试失败: ${error.message}`
    }
  }
}

function testVue3() {
  const lib = loadedLibraries.value.find(lib => lib.name === 'Vue 3')
  if (lib && lib.result) {
    try {
      const hasCreateApp = typeof lib.result.createApp === 'function'
      const version = lib.result.version || '未知'
      lib.testResult = `Vue 版本: ${version}\ncreateApp 函数: ${hasCreateApp ? '✅ 可用' : '❌ 不可用'}`
    } catch (error) {
      lib.testResult = `测试失败: ${error.message}`
    }
  }
}
</script> 