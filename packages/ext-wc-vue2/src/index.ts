import magic, { useProps } from '@magic-microservices/magic';
import { extApp, extJs } from '@frontendUtils/ext-vue2';
import { App, propTypes } from './ExtComponent';

declare global {
  interface Window {
    ExtWcVue2: any;
    Vue: any;
  }
}

// 检查 Vue2 依赖
function checkVue2Dependency() {
  if (!window.Vue || window.Vue.version?.startsWith('3')) {
    console.error(`
      [ext-wc-vue2] 错误: 需要全局引入 Vue 2.x
      请在使用前添加:
      <script src="https://unpkg.com/vue@2.7.14/dist/vue.min.js"></script>

      当前检测到的 Vue 版本: ${window.Vue?.version ?? '未检测到'}
    `);
    throw new Error('ext-wc-vue2 需要 Vue 2.x 依赖');
  }
}

// 注册 Web Component
function registerWebComponent() {
  if (window.customElements.get('ext-component')) {
    console.warn('[ext-wc-vue2] Web Component 已经注册，跳过重复注册');
    return;
  }

  try {
    checkVue2Dependency();
    magic('ext-component', App, {
      propTypes,
    });
    console.log('[ext-wc-vue2] Web Component 注册成功');
  } catch (error) {
    console.error('[ext-wc-vue2] Web Component 注册失败:', error);
    throw error;
  }
}

// 立即注册
registerWebComponent();

export {
  useProps,
  extApp,
  extJs,
};

