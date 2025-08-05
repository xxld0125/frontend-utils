import { ExtComponent } from '@frontendUtils/ext-vue2';
import type { Module } from '@magic-microservices/magic';
import {
  getSlot,
  getVue2Node,
  getVue2Children,
  fire,
} from './utils';

// 声明外部 Vue 依赖
declare const Vue: any;

// 扩展 Element 类型以支持 __vueInstance 属性
interface ExtendedElement extends Element {
  __vueInstance?: any;
}

export const propTypes = {
  name: String,
  checker: Function,
  'wc-mode': Boolean,
  'com-props': Object,
  styles: Object,
  'class-name': String,
  'disable-scopecss': Boolean,
  'disable-sandbox': Boolean,
  'shadow-dom': Boolean,
  'error-handler': Function,
  'export-name': String,
  'loading-handler': Function,
  'block-on-error': Boolean,
  'dev-url': String,
};

function mapProps(props: Record<string, any>): any {
  return {
    name: props.name,
    checker: props.checker,
    wcMode: props['wc-mode'],
    comProps: props['com-props'] ?? {},
    exportName: props['export-name'],
    blockOnError: props['block-on-error'] !== false, // 默认为 true
    devUrl: props['dev-url'],
    errorHandler: props['error-handler'],
    loadingHandler: props['loading-handler'],
    disableScopecss: props['disable-scopecss'],
    disableSandbox: props['disable-sandbox'],
    shadowDOM: props['shadow-dom'],
    className: props['class-name'],
    style: props.styles,
  };
}

function getVueAppConfig(container: Element, props: any, magicInstance: HTMLElement) {
  const vueProps = mapProps(props);

  // 获取插槽元素
  const loadingEl = getSlot(magicInstance, 'loading');
  const errorEl = getSlot(magicInstance, 'error');

  // 获取默认子元素（排除插槽和容器）
  const defaultChildren = Array.from(magicInstance.children).filter(
    (item) => !item.slot && item !== container
  ) as HTMLElement[];

  return {
    props: vueProps,
    slots: {
      loading: loadingEl,
      error: errorEl,
      default: defaultChildren
    }
  };
}

// 防抖函数，解决 Web Components 多次属性变更问题
function debounce<T extends (...args: any[]) => void>(fn: T, wait: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return ((...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(null, args);
    }, wait);
  }) as T;
}

export const App: Module = {
  mount: debounce(function (container: ExtendedElement, props: any, magicInstance: HTMLElement) {
    const { props: vueProps, slots } = getVueAppConfig(container, props, magicInstance);

    try {
      const vueInstance = new Vue({
        render(h: any) {
          return h(ExtComponent, {
            props: {
              ...vueProps,
              errorHandler: (error: any) => {
                handleError(error, vueProps, magicInstance);
              },
              loadingHandler: (loading: boolean) => {
                handleLoading(loading, vueProps, magicInstance);
              }
            }
          }, createSlotContent(h, slots));
        },
        errorCaptured(err: any, vm: any, info: any) {
          console.error('[ext-wc-vue2] Vue 渲染错误:', err, info);
          handleError(err, vueProps, magicInstance);
          return false;
        }
      });

      vueInstance.$mount(container as Element);
      container.__vueInstance = vueInstance;

    } catch (error) {
      console.error('[ext-wc-vue2] 挂载失败:', error);
      handleError(error, vueProps, magicInstance);
    }
  }, 100),

  updated: debounce(function (this: Module, attributeName: string, propsValue: any, container: ExtendedElement, props: any, magicInstance: HTMLElement) {
    const vueInstance = container.__vueInstance;
    if (!vueInstance) {
      console.warn('[ext-wc-vue2] Vue 实例不存在，重新挂载');
      this.mount(container, props, magicInstance);
      return;
    }

    const { props: vueProps } = getVueAppConfig(container, props, magicInstance);
    if (typeof vueProps.checker === 'string') return;

    try {
      // 更新组件属性
      const extComponent = vueInstance.$children[0];
      if (extComponent) {
        Object.assign(extComponent.$props, vueProps);
        extComponent.$forceUpdate();
      }
    } catch (error) {
      console.error('[ext-wc-vue2] 更新失败:', error);
      handleError(error, vueProps, magicInstance);
    }
  }, 100),

  unmount(container: ExtendedElement) {
    const vueInstance = container.__vueInstance;
    if (vueInstance) {
      try {
        vueInstance.$destroy();
        if (vueInstance.$el?.parentNode) {
          vueInstance.$el.parentNode.removeChild(vueInstance.$el);
        }
      } catch (error) {
        console.error('[ext-wc-vue2] 卸载失败:', error);
      } finally {
        delete container.__vueInstance;
      }
    }
  }
};

// 错误处理
function handleError(error: any, vueProps: any, magicInstance: HTMLElement) {
  if (vueProps.errorHandler) {
    try {
      vueProps.errorHandler(error);
    } catch (handlerError) {
      console.error('[ext-wc-vue2] 错误处理器执行失败:', handlerError);
    }
  }
  fire('error', error, magicInstance);
}

// 加载状态处理
function handleLoading(loading: boolean, vueProps: any, magicInstance: HTMLElement) {
  if (vueProps.loadingHandler) {
    try {
      vueProps.loadingHandler(loading);
    } catch (handlerError) {
      console.error('[ext-wc-vue2] 加载处理器执行失败:', handlerError);
    }
  }
  fire('loading', loading, magicInstance);
}

// 创建插槽内容
function createSlotContent(h: any, slots: any) {
  const slotContent: any[] = [];

  // 默认插槽
  if (slots.default && slots.default.length > 0) {
    const defaultVNodes = getVue2Children(slots.default, h);
    slotContent.push(...defaultVNodes);
  }

  // loading 插槽
  if (slots.loading) {
    const loadingVNode = getVue2Node(slots.loading, h);
    if (loadingVNode) {
      // 设置插槽名称
      loadingVNode.data = loadingVNode.data ?? {};
      loadingVNode.data.slot = 'loading';
      slotContent.push(loadingVNode);
    }
  }

  // error 插槽
  if (slots.error) {
    const errorVNode = getVue2Node(slots.error, h);
    if (errorVNode) {
      // 设置插槽名称
      errorVNode.data = errorVNode.data ?? {};
      errorVNode.data.slot = 'error';
      slotContent.push(errorVNode);
    }
  }

  return slotContent;
}
