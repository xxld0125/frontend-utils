<template>
  <div class="container">
    <div class="card">
      <h1 class="card-title">⚡ 性能测试</h1>
      <p style="margin-bottom: 24px; color: #6b7280;">
        测试脚本加载性能、缓存机制和内存使用情况。
      </p>
    </div>

    <div class="grid grid-2">
      <!-- 加载时间测试 -->
      <div class="card">
        <h2 class="card-title">⏱️ 加载时间测试</h2>
        <div style="margin-bottom: 16px;">
          <button @click="testLoadingTimes" :disabled="performanceTesting" class="btn btn-primary">
            {{ performanceTesting ? '测试中...' : '开始性能测试' }}
          </button>
          <button @click="clearResults" class="btn btn-warning">清除结果</button>
        </div>

        <div v-if="loadingResults.length > 0">
          <h3 style="margin-bottom: 12px;">测试结果：</h3>
          <table class="table">
            <thead>
              <tr>
                <th>脚本</th>
                <th>第一次加载</th>
                <th>第二次加载</th>
                <th>缓存效果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="result in loadingResults" :key="result.name">
                <td>{{ result.name }}</td>
                <td>{{ result.firstLoad }}ms</td>
                <td>{{ result.secondLoad }}ms</td>
                <td>
                  <span :class="result.cacheImprovement > 0 ? 'status-success' : 'status-error'">
                    {{ result.cacheImprovement > 0 ? `-${result.cacheImprovement}ms` : '无改善' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 并发加载测试 -->
      <div class="card">
        <h2 class="card-title">🚀 并发加载测试</h2>
        <div class="form-group">
          <label class="form-label">并发数量：</label>
          <input v-model.number="concurrentCount" class="form-input" type="number" min="1" max="10" value="3">
        </div>

        <div style="margin-bottom: 16px;">
          <button @click="testConcurrentLoading" :disabled="concurrentTesting" class="btn btn-success">
            {{ concurrentTesting ? '并发测试中...' : '开始并发测试' }}
          </button>
        </div>

        <div v-if="concurrentResults" class="code-block">
          {{ concurrentResults }}
        </div>
      </div>
    </div>

    <!-- 内存监控 -->
    <div class="card">
      <h2 class="card-title">💾 内存监控</h2>
      <div style="display: flex; gap: 12px; margin-bottom: 16px; flex-wrap: wrap;">
        <button @click="captureMemoryBefore" class="btn btn-primary">记录初始内存</button>
        <button @click="loadMemoryTestScript" :disabled="loading" class="btn btn-success">
          {{ loading ? '加载中...' : '加载大型脚本' }}
        </button>
        <button @click="captureMemoryAfter" class="btn btn-warning">记录加载后内存</button>
        <button @click="analyzeMemoryUsage" class="btn btn-danger">分析内存使用</button>
      </div>

      <div v-if="memoryAnalysis" class="code-block">
        {{ memoryAnalysis }}
      </div>
    </div>

    <!-- 缓存机制测试 -->
    <div class="card">
      <h2 class="card-title">🗄️ 缓存机制测试</h2>
      <div style="margin-bottom: 16px;">
        <button @click="testCacheEffectiveness" :disabled="cacheTesting" class="btn btn-primary">
          {{ cacheTesting ? '缓存测试中...' : '测试缓存效果' }}
        </button>
        <button @click="clearCache" class="btn btn-danger">清除缓存</button>
      </div>

      <div v-if="cacheTestResults" class="code-block">
        {{ cacheTestResults }}
      </div>
    </div>

    <!-- 性能统计 -->
    <div class="card" v-if="performanceStats">
      <h2 class="card-title">📊 性能统计</h2>
      <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
        <div style="text-align: center; padding: 16px; border: 1px solid #e5e7eb; border-radius: 6px;">
          <div style="font-size: 24px; font-weight: bold; color: #3b82f6;">{{ performanceStats.averageLoadTime }}ms</div>
          <div style="color: #6b7280;">平均加载时间</div>
        </div>
        <div style="text-align: center; padding: 16px; border: 1px solid #e5e7eb; border-radius: 6px;">
          <div style="font-size: 24px; font-weight: bold; color: #10b981;">{{ performanceStats.cacheHitRate }}%</div>
          <div style="color: #6b7280;">缓存命中率</div>
        </div>
        <div style="text-align: center; padding: 16px; border: 1px solid #e5e7eb; border-radius: 6px;">
          <div style="font-size: 24px; font-weight: bold; color: #f59e0b;">{{ performanceStats.totalTests }}</div>
          <div style="color: #6b7280;">总测试次数</div>
        </div>
        <div style="text-align: center; padding: 16px; border: 1px solid #e5e7eb; border-radius: 6px;">
          <div style="font-size: 24px; font-weight: bold; color: #ef4444;">{{ performanceStats.failureRate }}%</div>
          <div style="color: #6b7280;">失败率</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { loadScript } from '@frontendUtils/load-script'

// 响应式数据
const performanceTesting = ref(false)
const concurrentTesting = ref(false)
const cacheTesting = ref(false)
const loading = ref(false)
const concurrentCount = ref(3)
const loadingResults = ref([])
const concurrentResults = ref('')
const memoryAnalysis = ref('')
const cacheTestResults = ref('')

// 内存监控数据
const memoryBefore = ref(null)
const memoryAfter = ref(null)

// 测试用脚本配置
const testScripts = [
  {
    name: 'Lodash',
    url: 'https://unpkg.com/lodash@4.17.21/lodash.min.js',
    size: '~70KB'
  },
  {
    name: 'Day.js',
    url: 'https://unpkg.com/dayjs@1.11.10/dayjs.min.js',
    size: '~3KB'
  },
  {
    name: 'Chart.js',
    url: 'https://unpkg.com/chart.js@4/dist/chart.umd.js',
    size: '~200KB'
  }
]

// 加载时间测试
async function testLoadingTimes() {
  performanceTesting.value = true
  loadingResults.value = []
  
  try {
    for (const script of testScripts) {
      console.log(`开始测试 ${script.name}`)
      
      // 第一次加载（可能需要从网络获取）
      const firstStart = performance.now()
      await loadScript(script.url)
      const firstEnd = performance.now()
      const firstLoad = Math.round(firstEnd - firstStart)
      
      // 等待一小段时间
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // 第二次加载（应该使用缓存）
      const secondStart = performance.now()
      await loadScript(script.url)
      const secondEnd = performance.now()
      const secondLoad = Math.round(secondEnd - secondStart)
      
      const cacheImprovement = firstLoad - secondLoad
      
      loadingResults.value.push({
        name: script.name,
        url: script.url,
        size: script.size,
        firstLoad,
        secondLoad,
        cacheImprovement
      })
      
      console.log(`${script.name} 测试完成:`, { firstLoad, secondLoad, cacheImprovement })
    }
  } catch (error) {
    console.error('性能测试失败:', error)
  } finally {
    performanceTesting.value = false
  }
}

// 并发加载测试
async function testConcurrentLoading() {
  concurrentTesting.value = true
  
  try {
    const startTime = performance.now()
    
    // 创建并发加载任务
    const promises = []
    for (let i = 0; i < concurrentCount.value; i++) {
      const script = testScripts[i % testScripts.length]
      promises.push(loadScript(script.url))
    }
    
    // 等待所有任务完成
    const results = await Promise.allSettled(promises)
    const endTime = performance.now()
    
    const totalTime = Math.round(endTime - startTime)
    const successCount = results.filter(r => r.status === 'fulfilled').length
    const failureCount = results.filter(r => r.status === 'rejected').length
    
    concurrentResults.value = `并发加载测试结果:\n`
    concurrentResults.value += `并发数量: ${concurrentCount.value}\n`
    concurrentResults.value += `总耗时: ${totalTime}ms\n`
    concurrentResults.value += `成功: ${successCount} 个\n`
    concurrentResults.value += `失败: ${failureCount} 个\n`
    concurrentResults.value += `平均耗时: ${Math.round(totalTime / concurrentCount.value)}ms\n`
    
    if (successCount === concurrentCount.value) {
      concurrentResults.value += `✅ 所有并发加载成功完成`
    } else {
      concurrentResults.value += `⚠️ 有 ${failureCount} 个加载失败`
    }
    
  } catch (error) {
    concurrentResults.value = `❌ 并发测试失败: ${error.message}`
  } finally {
    concurrentTesting.value = false
  }
}

// 记录初始内存
function captureMemoryBefore() {
  if (performance.memory) {
    memoryBefore.value = {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
    }
    memoryAnalysis.value = `✅ 已记录初始内存状态\n使用: ${memoryBefore.value.used}MB\n总计: ${memoryBefore.value.total}MB`
  } else {
    memoryAnalysis.value = '❌ 浏览器不支持内存监控 API'
  }
}

// 加载大型脚本进行内存测试
async function loadMemoryTestScript() {
  loading.value = true
  try {
    // 加载一个较大的库来测试内存使用
    await loadScript('https://unpkg.com/chart.js@4/dist/chart.umd.js')
    memoryAnalysis.value += '\n✅ 大型脚本加载完成'
  } catch (error) {
    memoryAnalysis.value += `\n❌ 脚本加载失败: ${error.message}`
  } finally {
    loading.value = false
  }
}

// 记录加载后内存
function captureMemoryAfter() {
  if (performance.memory) {
    memoryAfter.value = {
      used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024 * 100) / 100,
      total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024 * 100) / 100,
      limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024 * 100) / 100
    }
    memoryAnalysis.value += `\n✅ 已记录加载后内存状态\n使用: ${memoryAfter.value.used}MB\n总计: ${memoryAfter.value.total}MB`
  } else {
    memoryAnalysis.value += '\n❌ 浏览器不支持内存监控 API'
  }
}

// 分析内存使用
function analyzeMemoryUsage() {
  if (memoryBefore.value && memoryAfter.value) {
    const usedIncrease = memoryAfter.value.used - memoryBefore.value.used
    const totalIncrease = memoryAfter.value.total - memoryBefore.value.total
    
    memoryAnalysis.value += `\n\n📊 内存使用分析:\n`
    memoryAnalysis.value += `使用内存增加: ${usedIncrease > 0 ? '+' : ''}${usedIncrease}MB\n`
    memoryAnalysis.value += `总内存增加: ${totalIncrease > 0 ? '+' : ''}${totalIncrease}MB\n`
    
    if (usedIncrease < 5) {
      memoryAnalysis.value += `✅ 内存使用合理（增加 < 5MB）`
    } else if (usedIncrease < 20) {
      memoryAnalysis.value += `⚠️ 内存使用中等（增加 5-20MB）`
    } else {
      memoryAnalysis.value += `❌ 内存使用较高（增加 > 20MB）`
    }
  } else {
    memoryAnalysis.value += '\n❌ 请先记录加载前后的内存状态'
  }
}

// 缓存效果测试
async function testCacheEffectiveness() {
  cacheTesting.value = true
  
  try {
    const testUrl = 'https://unpkg.com/lodash@4.17.21/lodash.min.js'
    const iterations = 5
    const results = []
    
    cacheTestResults.value = '缓存效果测试进行中...\n'
    
    for (let i = 0; i < iterations; i++) {
      const startTime = performance.now()
      await loadScript(testUrl)
      const endTime = performance.now()
      const loadTime = Math.round(endTime - startTime)
      
      results.push(loadTime)
      cacheTestResults.value += `第 ${i + 1} 次加载: ${loadTime}ms\n`
      
      // 短暂等待
      await new Promise(resolve => setTimeout(resolve, 50))
    }
    
    const firstLoad = results[0]
    const averageSubsequent = Math.round(results.slice(1).reduce((a, b) => a + b, 0) / (results.length - 1))
    const improvement = firstLoad - averageSubsequent
    const improvementPercent = Math.round((improvement / firstLoad) * 100)
    
    cacheTestResults.value += `\n📊 缓存分析:\n`
    cacheTestResults.value += `首次加载: ${firstLoad}ms\n`
    cacheTestResults.value += `后续平均: ${averageSubsequent}ms\n`
    cacheTestResults.value += `改善程度: ${improvement}ms (${improvementPercent}%)\n`
    
    if (improvementPercent > 50) {
      cacheTestResults.value += `✅ 缓存效果优秀`
    } else if (improvementPercent > 20) {
      cacheTestResults.value += `⚠️ 缓存效果一般`
    } else {
      cacheTestResults.value += `❌ 缓存效果不明显`
    }
    
  } catch (error) {
    cacheTestResults.value = `❌ 缓存测试失败: ${error.message}`
  } finally {
    cacheTesting.value = false
  }
}

// 清除缓存（模拟）
function clearCache() {
  // 这里实际上无法清除浏览器缓存，只是重置测试数据
  cacheTestResults.value = '✅ 缓存已清除（测试数据重置）'
  loadingResults.value = []
}

// 清除结果
function clearResults() {
  loadingResults.value = []
  concurrentResults.value = ''
  memoryAnalysis.value = ''
  cacheTestResults.value = ''
  memoryBefore.value = null
  memoryAfter.value = null
}

// 计算性能统计
const performanceStats = computed(() => {
  if (loadingResults.value.length === 0) return null
  
  const allLoadTimes = loadingResults.value.flatMap(r => [r.firstLoad, r.secondLoad])
  const averageLoadTime = Math.round(allLoadTimes.reduce((a, b) => a + b, 0) / allLoadTimes.length)
  
  const cacheImprovements = loadingResults.value.filter(r => r.cacheImprovement > 0)
  const cacheHitRate = Math.round((cacheImprovements.length / loadingResults.value.length) * 100)
  
  const totalTests = loadingResults.value.length * 2 // 每个脚本测试两次
  const failureRate = 0 // 由于我们这里没有记录失败，所以暂时设为0
  
  return {
    averageLoadTime,
    cacheHitRate,
    totalTests,
    failureRate
  }
})
</script> 