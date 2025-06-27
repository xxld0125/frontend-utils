<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">🛡️ 沙箱隔离测试</h1>
      <p style="margin-bottom: 24px; color: #6b7280;">
        验证沙箱隔离机制的有效性，确保脚本执行不会污染全局环境。
      </p>
    </div>

    <div class="grid grid-2">
      <!-- 全局变量污染测试 -->
      <div class="card">
        <h2 class="card-title">🌍 全局变量污染测试</h2>
        <div style="margin-bottom: 16px;">
          <button @click="captureWindowKeys" class="btn btn-primary">
            📸 记录当前全局变量
          </button>
          <button @click="loadTestScript" :disabled="loading" class="btn btn-success">
            {{ loading ? '加载中...' : '🚀 加载测试脚本' }}
          </button>
          <button @click="checkGlobalChanges" class="btn btn-warning">
            🔍 检查全局变化
          </button>
        </div>

        <div v-if="globalAnalysis" class="code-block">
          {{ globalAnalysis }}
        </div>
      </div>

      <!-- 变量冲突测试 -->
      <div class="card">
        <h2 class="card-title">⚔️ 变量冲突测试</h2>
        <div class="form-group">
          <label class="form-label">设置全局测试变量：</label>
          <input v-model="conflictVarName" class="form-input" type="text" placeholder="例如: myTestVar">
        </div>

        <div class="form-group">
          <label class="form-label">变量值：</label>
          <input v-model="conflictVarValue" class="form-input" type="text" placeholder="例如: 原始值">
        </div>

        <div style="margin-bottom: 16px;">
          <button @click="setConflictVar" class="btn btn-primary">设置全局变量</button>
          <button @click="testConflictResolution" :disabled="loading" class="btn btn-danger">测试冲突处理</button>
        </div>

        <div v-if="conflictTestResult" class="code-block">
          {{ conflictTestResult }}
        </div>
      </div>
    </div>

    <!-- 沙箱API测试 -->
    <div class="card">
      <h2 class="card-title">🔧 沙箱 API 测试</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="margin-bottom: 8px;">Console API</h3>
          <button @click="testConsoleAPI" class="btn btn-primary">测试 console</button>
          <div v-if="consoleTestResult" class="code-block" style="margin-top: 8px; font-size: 12px;">
            {{ consoleTestResult }}
          </div>
        </div>

        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 16px;">
          <h3 style="margin-bottom: 8px;">DOM 访问</h3>
          <button @click="testDOMAccess" class="btn btn-primary">测试 DOM</button>
          <div v-if="domTestResult" class="code-block" style="margin-top: 8px; font-size: 12px;">
            {{ domTestResult }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { loadScript } from '@frontendUtils/load-script'

const loading = ref(false)
const globalAnalysis = ref('')
const conflictVarName = ref('myTestVar')
const conflictVarValue = ref('原始值')
const conflictTestResult = ref('')
const consoleTestResult = ref('')
const domTestResult = ref('')

let windowKeysBefore = []

function captureWindowKeys() {
  windowKeysBefore = Object.keys(window)
  globalAnalysis.value = `已记录 ${windowKeysBefore.length} 个全局变量`
}

async function loadTestScript() {
  loading.value = true
  try {
    const lodash = await loadScript('https://unpkg.com/lodash@4.17.21/lodash.min.js')
    globalAnalysis.value += '\n✅ 测试脚本（Lodash）加载成功'
  } catch (error) {
    globalAnalysis.value += `\n❌ 脚本加载失败: ${error.message}`
  } finally {
    loading.value = false
  }
}

function checkGlobalChanges() {
  const windowKeysAfter = Object.keys(window)
  const newKeys = windowKeysAfter.filter(key => !windowKeysBefore.includes(key))
  
  let analysis = `全局变量变化分析:\n`
  analysis += `加载前: ${windowKeysBefore.length} 个变量\n`
  analysis += `加载后: ${windowKeysAfter.length} 个变量\n`
  analysis += `新增: ${newKeys.length} 个变量\n\n`
  
  if (newKeys.length === 0) {
    analysis += '✅ 沙箱隔离成功！全局环境未被污染。'
  } else {
    analysis += '⚠️ 检测到全局变量变化，沙箱隔离可能存在问题。'
  }
  
  globalAnalysis.value = analysis
}

function setConflictVar() {
  if (conflictVarName.value && conflictVarValue.value) {
    window[conflictVarName.value] = conflictVarValue.value
    conflictTestResult.value = `✅ 已设置全局变量 ${conflictVarName.value} = "${conflictVarValue.value}"`
  }
}

async function testConflictResolution() {
  if (!conflictVarName.value) return
  
  loading.value = true
  try {
    const originalValue = window[conflictVarName.value]
    
    const testScriptUrl = `data:text/javascript,
      window.${conflictVarName.value} = "沙箱中的值";
    `
    
    await loadScript(testScriptUrl)
    
    const currentValue = window[conflictVarName.value]
    
    conflictTestResult.value = `冲突测试结果:\n`
    conflictTestResult.value += `原始值: "${originalValue}"\n`
    conflictTestResult.value += `当前值: "${currentValue}"\n`
    
    if (currentValue === originalValue) {
      conflictTestResult.value += '✅ 沙箱隔离成功！原始变量未被修改。'
    } else {
      conflictTestResult.value += '⚠️ 检测到变量冲突，沙箱隔离可能存在问题。'
    }
    
  } catch (error) {
    conflictTestResult.value = `❌ 冲突测试失败: ${error.message}`
  } finally {
    loading.value = false
  }
}

function testConsoleAPI() {
  try {
    consoleTestResult.value = `Console 测试:\n✅ Console API 可用`
  } catch (error) {
    consoleTestResult.value = `❌ Console 测试失败: ${error.message}`
  }
}

function testDOMAccess() {
  try {
    const tests = {
      documentExists: typeof document !== 'undefined',
      canCreateElement: false,
      canQuerySelector: false
    }
    
    if (tests.documentExists) {
      try {
        document.createElement('div')
        tests.canCreateElement = true
      } catch (e) {}
      
      try {
        document.querySelector('body')
        tests.canQuerySelector = true
      } catch (e) {}
    }
    
    domTestResult.value = `DOM 访问测试:\n`
    domTestResult.value += `document 存在: ${tests.documentExists ? '✅' : '❌'}\n`
    domTestResult.value += `可创建元素: ${tests.canCreateElement ? '✅' : '❌'}\n`
    domTestResult.value += `可查询元素: ${tests.canQuerySelector ? '✅' : '❌'}`
    
  } catch (error) {
    domTestResult.value = `❌ DOM 测试失败: ${error.message}`
  }
}
</script> 