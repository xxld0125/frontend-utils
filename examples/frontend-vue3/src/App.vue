<template>
  <div>
    测试项目
    <ext-component name="ext-demo" :checker="useProps(checker)" :block-on-error="false" :export-name="exportName">
      原组件
    </ext-component>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { extApp, extJs, useProps } from '@frontendUtils/ext-wc-vue2'

const checker = () => true;

const exportName = ref('HelloWorld');

const extHandler = async (data) => {
  const fn = extJs({
    name: 'ext-demo',
    exportName: 'extFn',
    checker,
    originFn: (data) => {
      console.error('====originFn', data);
    },
    blockOnError: false,
  });

  const res = await fn(data, 2000);
  return res;
};

onMounted(async () => {
  window.ENVIRONMENT_EXT = {
    env: 'dev',
    'ares-ext': 'http://localhost:3000/ext-list'
  };

  extApp({
    appGroup: 'group',
    appName: 'name',
  });

  const res = await extHandler({
    name: '张三',
    age: 18,
  });
});

</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
