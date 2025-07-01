<template>
  <div id="app">
    <!-- 导航栏 -->
    <nav class="nav">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          Frontend Utils 功能验证
        </router-link>
        <ul class="nav-links">
          <li>
            <router-link to="/" class="nav-link" active-class="active">
              首页
            </router-link>
          </li>
          <li>
            <router-link to="/load-script" class="nav-link" active-class="active">
              Load Script 测试
            </router-link>
          </li>
          <li>
            <router-link to="/sandbox" class="nav-link" active-class="active">
              沙箱隔离测试
            </router-link>
          </li>
          <li>
            <router-link to="/performance" class="nav-link" active-class="active">
              性能测试
            </router-link>
          </li>
          <li>
            <router-link to="/cdn-core" class="nav-link" active-class="active">
              CDN Core 测试
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 主内容区域 -->
    <main>
      <router-view />
    </main>
  </div>
</template>

<script setup>
// 这里可以添加全局逻辑
</script>
