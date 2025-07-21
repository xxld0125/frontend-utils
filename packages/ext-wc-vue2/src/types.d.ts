// packages/ext-wc-vue2/src/types.d.ts

declare module 'vue' {
  const Vue: any;
  export = Vue;
}

declare global {
  interface Window {
    Vue: any;
    ExtWcVue2: any;
  }
}

export { };
