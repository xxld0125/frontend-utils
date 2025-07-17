<template>
  <div id="app">
    测试项目
    <ext-component name="demo" :checker="checker" :blockOnError="false" :exportName="exportName" :dev-url="devUrl" />
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
      devUrl: 'http://localhost:3000/index.umd.js',
    };
  },
  created() {
    window.ENVIRONMENT_EXT = {
      env: 'dev',
    };
    extApp({
      appGroup: 'kefu',
      appName: 'kefu-kffrontend',
    });

    console.error('==extJs', extJs);
  },
  async mounted() {
    console.time('extHandler');
    const res = await this.extHandler({
      name: '张三',
      age: 18,
    });

    console.error('===res', res);
    console.timeEnd('extHandler');
  },
  methods: {
    checker() {
      return false;
    },
    async extHandler(data) {
      const fn = extJs({
        name: 'demo',
        exportName: 'extFn',
        checker: this.checker,
        devUrl: 'http://localhost:3000/index.umd.js',
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
