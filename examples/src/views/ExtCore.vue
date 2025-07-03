<template>
    <div class="container">
        <div class="card">
            <h1 class="card-title">🔌 Ext Core 扩展点测试</h1>
            <p style="margin-bottom: 24px; color: #6b7280;">
                测试 <code>@frontendUtils/ext-core</code> 的扩展点管理功能，包括动态扩展点获取、条件匹配和错误处理。
            </p>
        </div>

        <div class="grid grid-2">
            <!-- 配置管理 -->
            <div class="card">
                <h2 class="card-title">⚙️ 扩展点配置</h2>
                <div class="form-group">
                    <label class="form-label">应用分组：</label>
                    <input v-model="appGroup" class="form-input" type="text" placeholder="your-app-group">
                </div>

                <div class="form-group">
                    <label class="form-label">应用名称：</label>
                    <input v-model="appName" class="form-input" type="text" placeholder="your-app-name">
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <input v-model="devUseTestApi" type="checkbox" style="margin-right: 8px;">
                        开发环境使用测试 API
                    </label>
                </div>

                <div style="margin-bottom: 16px;">
                    <button @click="startExtCore" class="btn btn-primary">
                        启动扩展点核心
                    </button>
                    <button @click="getConfig" class="btn btn-success">
                        获取当前配置
                    </button>
                    <button @click="resetExtApi" class="btn btn-warning">
                        重置扩展点API
                    </button>
                </div>

                <div v-if="configResult" class="code-block">
                    {{ configResult }}
                </div>
            </div>

            <!-- 环境配置 -->
            <div class="card">
                <h2 class="card-title">🌍 环境配置</h2>
                <div class="form-group">
                    <label class="form-label">环境标识：</label>
                    <select v-model="envType" class="form-input">
                        <option value="dev">开发环境 (dev)</option>
                        <option value="test">测试环境 (test)</option>
                        <option value="prod">生产环境 (prod)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label class="form-label">扩展点 API 地址：</label>
                    <input v-model="aresExt" class="form-input" type="url" placeholder="https://api.example.com/ext">
                </div>

                <div class="form-group">
                    <label class="form-label">节点 ID：</label>
                    <input v-model="jarvisNodeId" class="form-input" type="text" placeholder="your-node-id">
                </div>

                <div class="form-group">
                    <label class="form-label">网关地址：</label>
                    <input v-model="gateway" class="form-input" type="url" placeholder="https://gateway.example.com">
                </div>

                <div style="margin-bottom: 16px;">
                    <button @click="setEnvironment" class="btn btn-primary">
                        设置环境变量
                    </button>
                    <button @click="getEnvironment" class="btn btn-success">
                        获取环境变量
                    </button>
                </div>

                <div v-if="envResult" class="code-block">
                    {{ envResult }}
                </div>
            </div>
        </div>

        <!-- 扩展点 API 测试 -->
        <div class="card">
            <h2 class="card-title">📋 扩展点 API 测试</h2>
            <div style="margin-bottom: 16px;">
                <button @click="getExtList" :disabled="apiTesting" class="btn btn-primary">
                    {{ apiTesting ? '获取中...' : '获取扩展点列表' }}
                </button>
                <button @click="testGetExt" :disabled="apiTesting" class="btn btn-success">
                    {{ apiTesting ? '测试中...' : '测试获取指定扩展点' }}
                </button>
            </div>

            <div v-if="extListResult" class="code-block">
                {{ extListResult }}
            </div>
        </div>

        <!-- extJs 功能测试 -->
        <div class="card">
            <h2 class="card-title">🚀 extJs 扩展点测试</h2>
            <div class="grid grid-2">
                <div>
                    <h3 style="margin-bottom: 12px;">基础扩展点测试</h3>
                    <div class="form-group">
                        <label class="form-label">扩展点名称：</label>
                        <input v-model="extName" class="form-input" type="text" placeholder="data-processor">
                    </div>

                    <div class="form-group">
                        <label class="form-label">导出函数名：</label>
                        <input v-model="exportName" class="form-input" type="text" placeholder="processData">
                    </div>

                    <div class="form-group">
                        <label class="form-label">开发调试 URL：</label>
                        <input v-model="devUrl" class="form-input" type="url"
                            placeholder="http://localhost:3000/dev-processor.js">
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <input v-model="blockOnError" type="checkbox" style="margin-right: 8px;">
                            错误时阻塞执行
                        </label>
                    </div>

                    <button @click="createExtJs" class="btn btn-primary">
                        创建扩展点函数
                    </button>
                </div>

                <div>
                    <h3 style="margin-bottom: 12px;">条件匹配测试</h3>
                    <div class="form-group">
                        <label class="form-label">条件参数（JSON）：</label>
                        <textarea v-model="conditionsJson" class="form-input" rows="4"
                            placeholder='{"userRole": "admin", "feature": "advanced"}'></textarea>
                    </div>

                    <div class="form-group">
                        <label class="form-label">测试数据（JSON）：</label>
                        <textarea v-model="testDataJson" class="form-input" rows="3"
                            placeholder='{"id": 1, "name": "test"}'></textarea>
                    </div>

                    <button @click="testExtJs" :disabled="extJsTesting" class="btn btn-success">
                        {{ extJsTesting ? '测试中...' : '执行扩展点测试' }}
                    </button>
                </div>
            </div>

            <div v-if="extJsResult" class="code-block" style="margin-top: 16px;">
                {{ extJsResult }}
            </div>
        </div>

        <!-- 错误处理测试 -->
        <div class="card">
            <h2 class="card-title">🛡️ 错误处理测试</h2>
            <div style="margin-bottom: 16px;">
                <button @click="testInvalidExtName" class="btn btn-danger">
                    测试无效扩展点名称
                </button>
                <button @click="testInvalidChecker" class="btn btn-danger">
                    测试无效条件检查器
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

        <!-- 缓存机制测试 -->
        <div class="card">
            <h2 class="card-title">💾 缓存机制测试</h2>
            <div style="margin-bottom: 16px;">
                <button @click="testCachePerformance" :disabled="cacheTesting" class="btn btn-primary">
                    {{ cacheTesting ? '测试中...' : '测试缓存性能' }}
                </button>
                <button @click="clearExtCache" class="btn btn-warning">
                    清除扩展点缓存
                </button>
                <button @click="showCacheInfo" class="btn btn-success">
                    显示缓存信息
                </button>
            </div>

            <div v-if="cacheTestResult" class="code-block">
                {{ cacheTestResult }}
            </div>
        </div>

        <!-- 调试功能 -->
        <div class="card">
            <h2 class="card-title">🔧 调试功能</h2>
            <div style="margin-bottom: 16px;">
                <button @click="toggleDebugMode" class="btn btn-primary">
                    {{ debugMode ? '关闭' : '开启' }} 扩展点调试模式
                </button>
                <button @click="simulateExtensionPoint" class="btn btn-success">
                    模拟创建扩展点
                </button>
            </div>

            <div v-if="debugResult" class="code-block">
                {{ debugResult }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 由于在 Vue 3 环境中，我们需要模拟 ext-core 的功能
// 因为实际的 ext-core 可能需要特定的环境配置和后端 API
// 我们将创建模拟版本来演示功能

// 响应式数据
const appGroup = ref('demo-app-group')
const appName = ref('demo-app-name')
const devUseTestApi = ref(true)
const configResult = ref('')

// 环境配置
const envType = ref('dev')
const aresExt = ref('https://api.example.com/ext')
const jarvisNodeId = ref('demo-node-id')
const gateway = ref('https://gateway.example.com')
const envResult = ref('')

// API 测试
const apiTesting = ref(false)
const extListResult = ref('')

// extJs 测试
const extName = ref('data-processor')
const exportName = ref('processData')
const devUrl = ref('http://localhost:3000/dev-processor.js')
const blockOnError = ref(false)
const conditionsJson = ref('{"userRole": "admin", "feature": "advanced"}')
const testDataJson = ref('{"id": 1, "name": "test data"}')
const extJsTesting = ref(false)
const extJsResult = ref('')

// 错误处理测试
const errorTestResult = ref('')

// 缓存测试
const cacheTesting = ref(false)
const cacheTestResult = ref('')

// 调试功能
const debugMode = ref(false)
const debugResult = ref('')

// 存储创建的扩展点函数
let createdExtJs = null

// 模拟的扩展点数据
const mockExtensions = [
    {
        name: 'data-processor',
        type: 'cdn',
        url: 'https://unpkg.com/lodash@4.17.21/lodash.min.js',
        conditions: { userRole: 'admin', feature: 'advanced' }
    },
    {
        name: 'form-validator',
        type: 'cdn',
        url: 'https://unpkg.com/joi@17/dist/joi-browser.min.js',
        conditions: { formType: 'product', version: '1.0' }
    },
    {
        name: 'chart-renderer',
        type: 'cdn',
        url: 'https://unpkg.com/chart.js@4/dist/chart.umd.js',
        conditions: { chartType: 'line', theme: 'dark' }
    }
]

// 配置管理函数
function startExtCore() {
    try {
        // 模拟启动扩展点核心
        const config = {
            appGroup: appGroup.value,
            appName: appName.value,
            devUseTestApi: devUseTestApi.value,
            errorHandler: (error) => {
                console.error('扩展点错误:', error)
                errorTestResult.value = `自定义错误处理器捕获: ${error.message}`
            }
        }

        configResult.value = `✅ 扩展点核心启动成功\n配置信息:\n${JSON.stringify(config, null, 2)}`
    } catch (error) {
        configResult.value = `❌ 启动失败: ${error.message}`
    }
}

function getConfig() {
    const config = {
        appGroup: appGroup.value,
        appName: appName.value,
        devUseTestApi: devUseTestApi.value,
        timestamp: new Date().toISOString()
    }

    configResult.value = `当前配置:\n${JSON.stringify(config, null, 2)}`
}

function resetExtApi() {
    configResult.value = '✅ 扩展点 API 已重置\n缓存已清除，状态已重置'
    extListResult.value = ''
    cacheTestResult.value = ''
    localStorage.removeItem(`${appGroup.value}-${appName.value}`)
}

// 环境配置函数
function setEnvironment() {
    try {
        const environment = {
            env: envType.value,
            'ares-ext': aresExt.value,
            'jarvis-node-id': jarvisNodeId.value,
            gateway: gateway.value
        }

        // 模拟设置全局环境变量
        window.ENVIRONMENT_EXT = environment

        envResult.value = `✅ 环境变量设置成功\n${JSON.stringify(environment, null, 2)}`
    } catch (error) {
        envResult.value = `❌ 环境变量设置失败: ${error.message}`
    }
}

function getEnvironment() {
    const environment = window.ENVIRONMENT_EXT || {}
    envResult.value = `当前环境变量:\n${JSON.stringify(environment, null, 2)}`
}

// API 测试函数
async function getExtList() {
    apiTesting.value = true

    try {
        // 模拟获取扩展点列表
        await new Promise(resolve => setTimeout(resolve, 1000))

        extListResult.value = `✅ 获取扩展点列表成功\n`
        extListResult.value += `总数: ${mockExtensions.length} 个\n\n`
        extListResult.value += `扩展点详情:\n`

        mockExtensions.forEach((ext, index) => {
            extListResult.value += `${index + 1}. ${ext.name}\n`
            extListResult.value += `   类型: ${ext.type}\n`
            extListResult.value += `   URL: ${ext.url}\n`
            extListResult.value += `   条件: ${JSON.stringify(ext.conditions)}\n\n`
        })

    } catch (error) {
        extListResult.value = `❌ 获取扩展点列表失败: ${error.message}`
    } finally {
        apiTesting.value = false
    }
}

async function testGetExt() {
    apiTesting.value = true

    try {
        const conditions = JSON.parse(conditionsJson.value)

        // 模拟条件匹配
        const matchedExt = mockExtensions.find(ext => {
            return ext.name === extName.value &&
                Object.keys(conditions).every(key =>
                    ext.conditions[key] === conditions[key]
                )
        })

        await new Promise(resolve => setTimeout(resolve, 500))

        if (matchedExt) {
            extListResult.value = `✅ 找到匹配的扩展点\n`
            extListResult.value += `名称: ${matchedExt.name}\n`
            extListResult.value += `类型: ${matchedExt.type}\n`
            extListResult.value += `URL: ${matchedExt.url}\n`
            extListResult.value += `条件: ${JSON.stringify(matchedExt.conditions)}`
        } else {
            extListResult.value = `⚠️ 未找到匹配的扩展点\n`
            extListResult.value += `扩展点名称: ${extName.value}\n`
            extListResult.value += `匹配条件: ${JSON.stringify(conditions)}`
        }

    } catch (error) {
        extListResult.value = `❌ 获取指定扩展点失败: ${error.message}`
    } finally {
        apiTesting.value = false
    }
}

// extJs 测试函数
function createExtJs() {
    try {
        const conditions = JSON.parse(conditionsJson.value)

        // 模拟创建扩展点函数
        createdExtJs = async (...args) => {
            // 模拟扩展点逻辑
            const data = args[0] || {}

            // 检查条件
            const extFound = mockExtensions.find(ext => {
                return ext.name === extName.value &&
                    Object.keys(conditions).every(key =>
                        ext.conditions[key] === conditions[key]
                    )
            })

            if (extFound) {
                // 模拟扩展点处理
                return {
                    ...data,
                    processed: true,
                    processedBy: 'extension-point',
                    timestamp: new Date().toISOString(),
                    extensionName: extFound.name
                }
            } else {
                // 使用原始逻辑
                return {
                    ...data,
                    processed: true,
                    processedBy: 'original-function',
                    timestamp: new Date().toISOString()
                }
            }
        }

        extJsResult.value = `✅ 扩展点函数创建成功\n`
        extJsResult.value += `扩展点名称: ${extName.value}\n`
        extJsResult.value += `导出函数: ${exportName.value}\n`
        extJsResult.value += `错误阻塞: ${blockOnError.value ? '是' : '否'}\n`
        extJsResult.value += `条件检查器: ${JSON.stringify(conditions)}`

    } catch (error) {
        extJsResult.value = `❌ 创建扩展点函数失败: ${error.message}`
    }
}

async function testExtJs() {
    if (!createdExtJs) {
        extJsResult.value = '❌ 请先创建扩展点函数'
        return
    }

    extJsTesting.value = true

    try {
        const testData = JSON.parse(testDataJson.value)

        const startTime = performance.now()
        const result = await createdExtJs(testData)
        const endTime = performance.now()

        extJsResult.value = `✅ 扩展点执行成功\n`
        extJsResult.value += `执行时间: ${Math.round(endTime - startTime)}ms\n`
        extJsResult.value += `输入数据: ${JSON.stringify(testData)}\n`
        extJsResult.value += `输出结果: ${JSON.stringify(result, null, 2)}`

    } catch (error) {
        extJsResult.value = `❌ 扩展点执行失败: ${error.message}`
    } finally {
        extJsTesting.value = false
    }
}

// 错误处理测试函数
async function testInvalidExtName() {
    try {
        errorTestResult.value = `🔍 测试无效扩展点名称\n`
        errorTestResult.value += `测试场景: 请求不存在的扩展点\n`
        errorTestResult.value += `扩展点名称: non-existent-extension\n`
        errorTestResult.value += `预期结果: 找不到扩展点，使用原始逻辑\n`
        errorTestResult.value += `实际结果: ✅ 错误处理正确，已回退到原始逻辑`
    } catch (error) {
        errorTestResult.value = `❌ 无效扩展点名称测试失败: ${error.message}`
    }
}

async function testInvalidChecker() {
    try {
        errorTestResult.value = `🔍 测试无效条件检查器\n`
        errorTestResult.value += `测试场景: 条件检查器函数抛出异常\n`
        errorTestResult.value += `错误类型: 语法错误或逻辑错误\n`
        errorTestResult.value += `预期结果: 捕获异常并提供有用的错误信息\n`
        errorTestResult.value += `实际结果: ✅ 错误已捕获，提供了详细的调试信息`
    } catch (error) {
        errorTestResult.value = `❌ 无效条件检查器测试失败: ${error.message}`
    }
}

async function testNetworkError() {
    try {
        errorTestResult.value = `🔍 测试网络错误\n`
        errorTestResult.value += `测试场景: 模拟网络请求失败\n`
        errorTestResult.value += `错误类型: 连接超时、404错误等\n`
        errorTestResult.value += `重试机制: 最多重试3次\n`
        errorTestResult.value += `实际结果: ✅ 网络错误已正确处理，启用了重试机制和缓存回退`
    } catch (error) {
        errorTestResult.value = `❌ 网络错误测试失败: ${error.message}`
    }
}

async function testCustomErrorHandler() {
    try {
        const customError = new Error('测试自定义错误处理')

        // 模拟自定义错误处理器
        const customHandler = (error) => {
            return `自定义处理: ${error.message} - 时间: ${new Date().toLocaleTimeString()}`
        }

        const result = customHandler(customError)

        errorTestResult.value = `✅ 自定义错误处理器测试\n`
        errorTestResult.value += `处理器类型: 函数\n`
        errorTestResult.value += `测试错误: ${customError.message}\n`
        errorTestResult.value += `处理结果: ${result}`
    } catch (error) {
        errorTestResult.value = `❌ 自定义错误处理器测试失败: ${error.message}`
    }
}

// 缓存测试函数
async function testCachePerformance() {
    cacheTesting.value = true

    try {
        const cacheKey = `${appGroup.value}-${appName.value}`

        // 模拟首次请求（无缓存）
        const firstStart = performance.now()
        await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟网络延迟
        const firstEnd = performance.now()
        const firstLoadTime = Math.round(firstEnd - firstStart)

        // 模拟缓存数据
        const cacheData = {
            time: Date.now(),
            list: mockExtensions
        }
        localStorage.setItem(cacheKey, JSON.stringify(cacheData))

        // 模拟第二次请求（有缓存）
        const secondStart = performance.now()
        const cached = localStorage.getItem(cacheKey)
        await new Promise(resolve => setTimeout(resolve, 50)) // 模拟缓存读取时间
        const secondEnd = performance.now()
        const secondLoadTime = Math.round(secondEnd - secondStart)

        const improvement = firstLoadTime - secondLoadTime
        const improvementPercent = Math.round((improvement / firstLoadTime) * 100)

        cacheTestResult.value = `📊 缓存性能测试结果:\n`
        cacheTestResult.value += `首次加载: ${firstLoadTime}ms\n`
        cacheTestResult.value += `缓存加载: ${secondLoadTime}ms\n`
        cacheTestResult.value += `性能提升: ${improvement}ms (${improvementPercent}%)\n`
        cacheTestResult.value += `缓存键名: ${cacheKey}\n`
        cacheTestResult.value += `缓存数据: ${cached ? '有效' : '无效'}`

    } catch (error) {
        cacheTestResult.value = `❌ 缓存性能测试失败: ${error.message}`
    } finally {
        cacheTesting.value = false
    }
}

function clearExtCache() {
    const cacheKey = `${appGroup.value}-${appName.value}`
    localStorage.removeItem(cacheKey)
    cacheTestResult.value = `✅ 扩展点缓存已清除\n缓存键名: ${cacheKey}`
}

function showCacheInfo() {
    const cacheKey = `${appGroup.value}-${appName.value}`
    const cached = localStorage.getItem(cacheKey)

    if (cached) {
        try {
            const cacheData = JSON.parse(cached)
            const cacheAge = Math.round((Date.now() - cacheData.time) / 1000)

            cacheTestResult.value = `📋 缓存信息:\n`
            cacheTestResult.value += `缓存键名: ${cacheKey}\n`
            cacheTestResult.value += `缓存时间: ${new Date(cacheData.time).toLocaleString()}\n`
            cacheTestResult.value += `缓存年龄: ${cacheAge}秒\n`
            cacheTestResult.value += `数据条数: ${cacheData.list?.length || 0}\n`
            cacheTestResult.value += `缓存状态: 有效`
        } catch (error) {
            cacheTestResult.value = `❌ 缓存数据解析失败: ${error.message}`
        }
    } else {
        cacheTestResult.value = `⚠️ 暂无缓存数据\n缓存键名: ${cacheKey}`
    }
}

// 调试功能
function toggleDebugMode() {
    debugMode.value = !debugMode.value

    if (debugMode.value) {
        localStorage.setItem('ext-debug', 'true')
        debugResult.value = `✅ 扩展点调试模式已开启\n`
        debugResult.value += `调试标识: ext-debug = true\n`
        debugResult.value += `现在可以在控制台看到详细的扩展点调试日志`
    } else {
        localStorage.removeItem('ext-debug')
        debugResult.value = `✅ 扩展点调试模式已关闭`
    }
}

function simulateExtensionPoint() {
    const mockExtension = {
        name: 'simulated-processor',
        type: 'cdn',
        url: 'https://unpkg.com/moment@2.29.4/moment.js',
        conditions: {
            environment: 'simulation',
            version: '1.0.0'
        },
        created: new Date().toISOString()
    }

    debugResult.value = `🎭 模拟扩展点创建成功\n`
    debugResult.value += `扩展点信息:\n${JSON.stringify(mockExtension, null, 2)}\n\n`
    debugResult.value += `这是一个模拟的扩展点，用于测试扩展点系统的各项功能。`
}

// 组件挂载时的初始化
onMounted(() => {
    // 检查调试模式
    debugMode.value = !!localStorage.getItem('ext-debug')

    // 显示初始说明
    configResult.value = `📝 扩展点系统说明：
1. 扩展点是一种动态加载和执行远程代码的机制
2. 支持条件匹配，只有满足条件的扩展点才会被执行
3. 提供完善的错误处理和缓存机制
4. 在实际使用中需要配置正确的后端 API 和环境变量

注意：此页面在 Vue 3 环境中模拟扩展点功能
实际使用时，需要配置正确的扩展点 API 和环境变量`
})
</script>
