import { getErrorHandler, getUrl, loadScript, type ErrorHandlerType } from '@frontendUtils/cdn-core';
import { getConfig } from './config';
import { version } from '../package.json';

// Vue 组件实例接口
interface VueComponent {
  $slots: any;
  $createElement: any;
  $emit: (event: string, ...args: any[]) => void;
  url: string;
  exportName?: string;
  comProps: Record<string, any>;
  comEvents: Record<string, any>;
  errorHandler?: (error: any) => void;
  loadingHandler?: (loading: boolean) => void;
  hasError: boolean;
  Com: any;
  config: ReturnType<typeof getConfig>;
  computedError: any;
  computedLoading: any;
  computedLoadingHandler: (loading: boolean) => void;
  computedUrl: string;
  computedProps: any;
  loadCom(): void;
  handlerError(error: any): void;
}

export default {
  name: 'CdnComponent',
  props: {
    // 资源地址
    url: {
      type: String,
      required: true,
    },
    // 导出名称
    exportName: String,
    // 组件属性
    comProps: {
      type: Object,
      default: () => ({}),
    },
    // 事件
    comEvents: {
      type: Object,
      default: () => ({}),
    },
    // 错误处理
    errorHandler: Function,
    // 加载处理
    loadingHandler: Function,
  },
  inheritAttrs: false,
  data() {
    return {
      hasError: false,
      Com: null,
      config: getConfig(),
    }
  },
  computed: {
    computedError(this: VueComponent) {
      if (this.$slots.error) return this.$slots.error[0] ?? this.$slots.error;
      const config = this.config as any;
      if (config.errorFallback) {
        if (typeof config.errorFallback === 'string') return this.$createElement('div', {}, config.errorFallback);
        return this.$createElement(config.errorFallback);
      }
      return this.$createElement('div', {}, '发生错误，请重试...');
    },
    computedLoading(this: VueComponent) {
      if (this.$slots.loading) return this.$slots.loading[0] ?? this.$slots.loading;
      const config = this.config as any;
      if (config.loadingFallback) {
        if (typeof config.loadingFallback === 'string') return this.$createElement('div', {}, config.loadingFallback);
        return this.$createElement(config.loadingFallback);
      }
      return this.$createElement('div', {}, '加载中...');
    },
    computedLoadingHandler(this: VueComponent): (loading: boolean) => void {
      return (loading: boolean) => {
        this.$emit('loading', loading);
        if (this.loadingHandler) {
          this.loadingHandler(loading);
        }
      }
    },
    computedUrl(this: VueComponent): string {
      return getUrl(this.url);
    },
    computedProps(this: VueComponent) {
      return {
        props: this.comProps,
        on: this.comEvents,
      };
    }
  },
  watch: {
    url(this: VueComponent) {
      this.loadCom();
    },
    exportName(this: VueComponent) {
      this.loadCom();
    },
  },
  methods: {
    loadCom(this: VueComponent): void {
      // 没有 url 则什么都不做
      if (!this.url) return;

      this.hasError = false;
      this.computedLoadingHandler(true);

      loadScript(this.computedUrl, this.exportName)
        .then((res) => {
          if (typeof res === 'object') {
            this.Com = res;
          } else {
            throw new Error(`[@frontendUtils/cdn-vue2 ${version}]: 加载的内容数据为 ${typeof res}，不是 Vue 组件 ${String(res)}，\r\n其他信息：url 为 ${this.computedUrl}，exportName 为 ${this.exportName}，解决方案：扩展点开发者，首先确保导出的确实是组件，再确认没问题后，再找架构组人员一起分析问题`);
          }
        })
        .finally(() => {
          this.computedLoadingHandler(false);
        })
        .catch((error) => {
          this.handlerError(error);
        });
    },
    // 处理错误
    handlerError(this: VueComponent, error: any): void {
      if (this.hasError) return;
      this.hasError = true;
      const errorHandler = getErrorHandler(this.errorHandler as ErrorHandlerType);
      errorHandler(error);
      this.$emit('error', error);
    },
  },
  // 当组件渲染出现异常时，要捕获异常
  errorCaptured(this: VueComponent, error: Error): boolean {
    this.handlerError(new Error(`[@frontendUtils/cdn-vue2 ${version}]: Vue 渲染失败，${error.name} ${error.message}`));
    return false;
  },
  render(this: VueComponent, createElement: any) {
    // 如果有错误，则渲染错误内容
    if (this.hasError) return this.computedError;
    // URL 不存在应该报错
    if (!this.url) return createElement('div', '资源链接不存在，请检查');
    // 如果还在加载中，则显示加载内容
    if (!this.Com) return this.computedLoading;
    // 创建组件
    return createElement(this.Com, this.computedProps, this.$slots.default);
  },
  // 开始加载远程组件
  created(this: VueComponent): void {
    this.loadCom();
  },
};
