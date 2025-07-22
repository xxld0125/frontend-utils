<template>
  <div id="app">
    测试项目
    <ext-component name="ext-demo" :checker="checker" :blockOnError="false" :exportName="exportName">
      原组件
    </ext-component>
  </div>
</template>

<script>
import { ExtComponent, extApp, extJs } from '@frontendUtils/ext-vue2';
export default {
  name: 'App',
  components: {
    ExtComponent,
  },
  data() {
    return {
      exportName: 'HelloWorld',
    };
  },
  created() {
    window.ENVIRONMENT_EXT = {
      env: 'dev',
      'ares-ext': 'http://localhost:3000/ext-list',
      env: 'dev'
    };
    extApp({
      appGroup: 'kefu',
      appName: 'kefu-kffrontend',
    });
  },
  async mounted() {
    await this.extHandler({
      name: '张三',
      age: 18,
    });
  },
  methods: {
    checker() {
      return true;
    },
    async extHandler(data) {
      const fn = extJs({
        name: 'ext-demo',
        exportName: 'extFn',
        checker: this.checker,
        originFn: (data) => {
          console.error('====originFn', data);
        },
        blockOnError: false,
      });

      const res = await fn(data, 2000);

      return res;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
