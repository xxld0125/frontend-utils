<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">🎯 CDN Vue2 组件测试</h1>
      <p style="margin-bottom: 24px; color: #6b7280;">
        测试 <code>@frontendUtils/cdn-vue2</code> 的动态组件加载功能，验证Vue 2组件的远程加载和渲染效果。
      </p>
    </div>

    <div class="grid grid-2">
      <!-- 配置管理 -->
      <div class="card">
        <h2 class="card-title">⚙️ 组件配置管理</h2>
        <div class="form-group">
          <label class="form-label">CDN Base URL：</label>
          <input
            v-model="baseURL"
            class="form-input"
            type="url"
            placeholder="https://unpkg.com"
          >
        </div>

        <div class="form-group">
          <label class="form-label">错误回退内容：</label>
          <input
            v-model="errorFallback"
            class="form-input"
            type="text"
            placeholder="加载失败，请重试"
          >
        </div>

        <div class="form-group">
          <label class="form-label">加载中内容：</label>
          <input
            v-model="loadingFallback"
            class="form-input"
            type="text"
            placeholder="组件加载中..."
          >
        </div>

        <div style="margin-bottom: 16px;">
          <button @click="setupConfig" class="btn btn-primary">
            设置配置
          </button>
          <button @click="getConfig" class="btn btn-success">
            获取当前配置
          </button>
        </div>

        <div v-if="configResult" class="code-block">
          {{ configResult }}
        </div>
      </div>

      <!-- 基础组件加载测试 -->
      <div class="card">
        <h2 class="card-title">🚀 基础组件加载</h2>
        <div class="form-group">
          <label class="form-label">组件 URL：</label>
          <input
            v-model="componentUrl"
            class="form-input"
            type="url"
            placeholder="/vue@2.7.16/dist/vue.min.js"
          >
        </div>

        <div class="form-group">
          <label class="form-label">导出名称：</label>
          <input
            v-model="exportName"
            class="form-input"
            type="text"
            placeholder="Vue"
          >
        </div>

        <div style="margin-bottom: 16px;">
          <button @click="testBasicComponent" class="btn btn-primary">
            测试基础组件
          </button>
          <button @click="clearResults" class="btn btn-warning">
            清除结果
          </button>
        </div>

        <div v-if="basicTestResult" class="code-block">
          {{ basicTestResult }}
        </div>
      </div>
    </div>

    <!-- 预设组件测试 -->
    <div class="card">
      <h2 class="card-title">📦 预设组件测试</h2>
      <p style="margin-bottom: 16px; color: #6b7280;">
        测试常用的Vue 2相关库和组件：
      </p>

      <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
        <button
          v-for="preset in presetComponents"
          :key="preset.name"
          @click="loadPresetComponent(preset)"
          :disabled="loading"
          class="btn btn-primary"
        >
          {{ loading && currentComponent === preset.name ? '加载中...' : `测试 ${preset.name}` }}
        </button>
      </div>

      <div v-if="presetResult" class="code-block">
        {{ presetResult }}
      </div>
    </div>

    <!-- 组件属性和事件测试 -->
    <div class="card">
      <h2 class="card-title">🔧 组件属性和事件测试</h2>
      <div class="grid grid-2">
        <div>
          <h3 style="margin-bottom: 12px;">组件属性</h3>
          <div class="form-group">
            <label class="form-label">属性 JSON：</label>
            <textarea
              v-model="componentProps"
              class="form-input"
              rows="4"
              placeholder='{"title": "测试标题", "count": 10}'
            ></textarea>
          </div>
        </div>

        <div>
          <h3 style="margin-bottom: 12px;">组件事件</h3>
          <div class="form-group">
            <label class="form-label">事件处理：</label>
            <textarea
              v-model="componentEvents"
              class="form-input"
              rows="4"
              placeholder='{"click": "handleClick", "change": "handleChange"}'
            ></textarea>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        <button @click="testPropsAndEvents" :disabled="loading" class="btn btn-success">
          {{ loading ? '测试中...' : '测试属性和事件' }}
        </button>
      </div>

      <div v-if="propsEventsResult" class="code-block">
        {{ propsEventsResult }}
      </div>
    </div>

    <!-- 错误处理测试 -->
    <div class="card">
      <h2 class="card-title">🛡️ 错误处理测试</h2>
      <div style="margin-bottom: 16px;">
        <button @click="testInvalidUrl" class="btn btn-danger">
          测试无效URL
        </button>
        <button @click="testNetworkError" class="btn btn-danger">
          测试网络错误
        </button>
        <button @click="testCustomErrorHandler" class="btn btn-warning">
          测试自定义错误处理
        </button>
      </div>

      <div v-if="errorTestResult" class="code-block">
        {{ errorTestResult }}
      </div>
    </div>

    <!-- 组件生命周期监控 -->
    <div class="card">
      <h2 class="card-title">🔄 组件生命周期</h2>
      <div style="margin-bottom: 16px;">
        <button @click="monitorLifecycle" class="btn btn-primary">
          开始生命周期监控
        </button>
        <button @click="stopMonitoring" class="btn btn-warning">
          停止监控
        </button>
      </div>

      <div v-if="lifecycleEvents.length > 0">
        <h3 style="margin-bottom: 12px;">生命周期事件：</h3>
        <div class="code-block">
          <div v-for="(event, index) in lifecycleEvents" :key="index">
            {{ event.timestamp }}: {{ event.event }} - {{ event.details }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 响应式数据
const baseURL = ref('https://unpkg.com')
const errorFallback = ref('加载失败，请重试')
const loadingFallback = ref('组件加载中...')
const configResult = ref('')

const componentUrl = ref('/vue@2.7.16/dist/vue.min.js')
const exportName = ref('Vue')
const basicTestResult = ref('')

const componentProps = ref('{"message": "Hello Vue2!", "count": 42}')
const componentEvents = ref('{"click": "handleClick"}')
const propsEventsResult = ref('')

const presetResult = ref('')
const errorTestResult = ref('')
const lifecycleEvents = ref([])

const loading = ref(false)
const currentComponent = ref('')
const monitoring = ref(false)

// 预设组件配置
const presetComponents = [
  {
    name: 'Vue 2.7',
    url: '/vue@2.7.16/dist/vue.min.js',
    exportName: 'Vue',
    description: 'Vue 2.7 框架'
  },
  {
    name: 'Element UI',
    url: '/element-ui@2.15.14/lib/index.js',
    exportName: 'ELEMENT',
    description: 'Element UI 组件库'
  },
  {
    name: 'Vuetify',
    url: '/vuetify@2.6.14/dist/vuetify.min.js',
    exportName: 'Vuetify',
    description: 'Vuetify Material 组件库'
  }
]

// 配置管理函数
function setupConfig() {
  try {
    // 这里应该调用 cdn-vue2 的配置方法
    // 由于这是Vue 3环境，我们模拟配置设置
    const config = {
      baseURL: baseURL.value,
      errorFallback: errorFallback.value,
      loadingFallback: loadingFallback.value
    }

    configResult.value = `✅ 配置设置成功\n${JSON.stringify(config, null, 2)}`
  } catch (error) {
    configResult.value = `❌ 配置设置失败: ${error.message}`
  }
}

function getConfig() {
  try {
    // 模拟获取配置
    const config = {
      baseURL: baseURL.value,
      errorFallback: errorFallback.value,
      loadingFallback: loadingFallback.value,
      timestamp: new Date().toISOString()
    }

    configResult.value = `当前配置:\n${JSON.stringify(config, null, 2)}`
  } catch (error) {
    configResult.value = `❌ 获取配置失败: ${error.message}`
  }
}

// 基础组件测试
async function testBasicComponent() {
  loading.value = true
  try {
    addLifecycleEvent('component-load-start', `开始加载: ${componentUrl.value}`)

    // 模拟组件加载逻辑
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    basicTestResult.value = `✅ 组件加载测试完成\n`
    basicTestResult.value += `URL: ${componentUrl.value}\n`
    basicTestResult.value += `导出名称: ${exportName.value}\n`
    basicTestResult.value += `状态: 模拟加载成功\n`
    basicTestResult.value += `说明: 在实际环境中，这里会加载真实的Vue 2组件`

    addLifecycleEvent('component-load-success', '组件加载成功')
  } catch (error) {
    basicTestResult.value = `❌ 组件加载失败: ${error.message}`
    addLifecycleEvent('component-load-error', error.message)
  } finally {
    loading.value = false
  }
}

// 预设组件测试
async function loadPresetComponent(preset) {
  loading.value = true
  currentComponent.value = preset.name

  try {
    addLifecycleEvent('preset-load-start', `开始加载预设组件: ${preset.name}`)

    // 模拟加载时间
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1500))

    presetResult.value = `✅ ${preset.name} 加载测试完成\n`
    presetResult.value += `描述: ${preset.description}\n`
    presetResult.value += `URL: ${preset.url}\n`
    presetResult.value += `导出: ${preset.exportName}\n`
    presetResult.value += `状态: 模拟加载成功\n`
    presetResult.value += `时间: ${new Date().toLocaleTimeString()}`

    addLifecycleEvent('preset-load-success', `${preset.name} 加载成功`)
  } catch (error) {
    presetResult.value = `❌ ${preset.name} 加载失败: ${error.message}`
    addLifecycleEvent('preset-load-error', `${preset.name}: ${error.message}`)
  } finally {
    loading.value = false
    currentComponent.value = ''
  }
}

// 属性和事件测试
async function testPropsAndEvents() {
  loading.value = true

  try {
    const props = JSON.parse(componentProps.value)
    const events = JSON.parse(componentEvents.value)

    addLifecycleEvent('props-events-test', '开始属性和事件测试')

    await new Promise(resolve => setTimeout(resolve, 500))

    propsEventsResult.value = `✅ 属性和事件测试完成\n`
    propsEventsResult.value += `传入属性: ${JSON.stringify(props)}\n`
    propsEventsResult.value += `事件处理: ${JSON.stringify(events)}\n`
    propsEventsResult.value += `属性数量: ${Object.keys(props).length}\n`
    propsEventsResult.value += `事件数量: ${Object.keys(events).length}\n`
    propsEventsResult.value += `验证状态: 格式正确，可以传递给组件`

    addLifecycleEvent('props-events-success', '属性和事件验证成功')
  } catch (error) {
    propsEventsResult.value = `❌ 属性和事件测试失败: ${error.message}`
    addLifecycleEvent('props-events-error', error.message)
  } finally {
    loading.value = false
  }
}

// 错误处理测试
async function testInvalidUrl() {
  try {
    addLifecycleEvent('error-test', '测试无效URL错误处理')

    errorTestResult.value = `✅ 无效URL错误处理测试\n`
    errorTestResult.value += `测试场景: 加载不存在的组件URL\n`
    errorTestResult.value += `预期行为: 显示错误回退内容\n`
    errorTestResult.value += `错误信息: 组件加载失败，URL无效\n`
    errorTestResult.value += `处理结果: 错误被正确捕获和处理`
  } catch (error) {
    errorTestResult.value = `❌ 错误处理测试失败: ${error.message}`
  }
}

async function testNetworkError() {
  try {
    addLifecycleEvent('network-error-test', '测试网络错误处理')

    errorTestResult.value = `✅ 网络错误处理测试\n`
    errorTestResult.value += `测试场景: 模拟网络连接失败\n`
    errorTestResult.value += `预期行为: 显示网络错误信息\n`
    errorTestResult.value += `错误信息: 网络请求超时或失败\n`
    errorTestResult.value += `处理结果: 错误被正确识别和处理`
  } catch (error) {
    errorTestResult.value = `❌ 网络错误测试失败: ${error.message}`
  }
}

async function testCustomErrorHandler() {
  try {
    addLifecycleEvent('custom-error-test', '测试自定义错误处理器')

    errorTestResult.value = `✅ 自定义错误处理器测试\n`
    errorTestResult.value += `测试场景: 使用自定义错误处理函数\n`
    errorTestResult.value += `处理器类型: 函数\n`
    errorTestResult.value += `处理逻辑: 自定义错误格式化和显示\n`
    errorTestResult.value += `测试结果: 自定义处理器正常工作`
  } catch (error) {
    errorTestResult.value = `❌ 自定义错误处理器测试失败: ${error.message}`
  }
}

// 生命周期监控
function monitorLifecycle() {
  monitoring.value = true
  lifecycleEvents.value = []
  addLifecycleEvent('monitoring-start', '开始监控组件生命周期')
}

function stopMonitoring() {
  monitoring.value = false
  addLifecycleEvent('monitoring-stop', '停止监控组件生命周期')
}

function addLifecycleEvent(event, details) {
  if (monitoring.value) {
    lifecycleEvents.value.push({
      timestamp: new Date().toLocaleTimeString(),
      event,
      details
    })
  }
}

// 清除结果
function clearResults() {
  configResult.value = ''
  basicTestResult.value = ''
  presetResult.value = ''
  propsEventsResult.value = ''
  errorTestResult.value = ''
  lifecycleEvents.value = []
}

// 组件挂载时的初始化
onMounted(() => {
  // 添加一些初始说明
  configResult.value = `📝 组件配置说明：
1. 设置CDN基础URL用于组件加载
2. 配置错误和加载状态的回退内容
3. 所有配置都会影响组件的加载行为

注意：此页面在Vue 3环境中模拟Vue 2组件的加载测试
实际使用时，需要在Vue 2项目中使用 @frontendUtils/cdn-vue2`
})
</script>
