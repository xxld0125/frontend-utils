import { extApi, type CheckerType } from '@frontendUtils/ext-core';
import { getErrorHandler, CdnComponent, getConfig, type CdnComponentConfig } from '@frontendUtils/cdn-vue2';

// Vue 组件实例接口
interface VueComponent {
  $slots: any;
  $createElement: any;
  $emit: (event: string, ...args: any[]) => void;
  name: string;
  checker: CheckerType;
  blockOnError: boolean;
  exportName?: string;
  comProps: Record<string, any>;
  comEvents: Record<string, any>;
  errorHandler?: (error: any) => void;
  loadingHandler?: (loading: boolean) => void;
  devUrl?: string;
  config: CdnComponentConfig;
  ext: any;
  loading: boolean;
  hasError: boolean;
  computedError: any;
  computedLoading: any;
  loadExt(): Promise<void>;
  handlerError(error: any): void;
}

export default {
  name: 'ExtComponent',
  props: {
    // 扩展点标识
    name: {
      type: String,
      required: true
    },
    // 检测函数
    checker: {
      type: Function,
      required: true
    },
    /**
       * 是否在内部或者接口报错的情况下，是阻塞原流程，还是走原逻辑
       * PS: 无论选择那种，错误都会上报到 errorHandler
       *
       * @example
       * blockOnError: ['雄安电建'].includes(state.orgcode) // 如果内部报错，只有雄安电建会阻塞流程，其他情况下会走原逻辑
       * blockOnError: false // 如果内部报错，总是会走原逻辑
       * blockOnError: true // 如果内部报错，总是会阻塞原逻辑，并显示报错
       */
    blockOnError: {
      type: Boolean,
      required: true,
      default: true
    },
    // 导出内容
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
    // 开发环境下直接调试 JS 链接
    devUrl: String
  },
  data() {
    return {
      config: getConfig(),
      ext: void 0,
      loading: true,
      hasError: false,
    }
  },
  computed: {
    computedError(this: VueComponent): any {
      if (this.$slots.error) return this.$slots.error;
      if (this.config.errorFallback) {
        if (typeof this.config.errorFallback === 'string') return this.$createElement('div', {}, this.config.errorFallback);
        return this.$createElement(this.config.errorFallback);
      }
      return this.$createElement('div', {}, '发生错误，请重试...');
    },
    computedLoading(this: VueComponent): any {
      if (this.$slots.loading) return this.$slots.loading;
      if (this.config.loadingFallback) {
        if (typeof this.config.loadingFallback === 'string') return this.$createElement('div', {}, this.config.loadingFallback);
        return this.$createElement(this.config.loadingFallback);
      }
      return this.$createElement('div', {}, '加载中...');
    },
  },
  watch: {
    loading: {
      handler(this: VueComponent): void {
        if (this.loadingHandler) {
          this.$emit('loading', this.loading);
          this.loadingHandler(this.loading);
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 请求扩展点接口
    async loadExt(this: VueComponent): Promise<void> {
      if (this.devUrl && (window as any)['ENVIRONMENT_EXT']?.['env'] === 'dev') {
        this.ext = {
          name: 'DEV_URL',
          url: this.devUrl,
          conditions: {},
        }
        this.loading = false;
        return;
      }

      this.loading = true;
      this.hasError = false;

      try {
        this.ext = await extApi.getExt(this.name, this.checker);
      } catch (error) {
        this.handlerError(error);
      } finally {
        this.loading = false;
      }
    },
    // 处理错误
    handlerError(this: VueComponent, error: any): void {
      if (this.hasError) return; // 如果已经处理过错误，直接返回，避免重复处理
      this.hasError = true; // 将组件标记为错误状态
      const errorHandler = getErrorHandler(this.errorHandler);
      errorHandler(error);
      this.$emit('error', error);
    },
  },
  render(this: VueComponent, h: any): any {
    if (this.hasError) return this.blockOnError ? this.computedError : this.$slots.default;
    if (this.loading) return this.computedLoading;
    if (!this.ext) return this.$slots.default;

    return h(CdnComponent, {
      props: {
        url: this.ext.url,
        comProps: this.comProps,
        comEvents: this.comEvents,
        exportName: this.exportName,
        errorHandler: this.errorHandler,
        loadingHandler: this.loadingHandler,
      },
    }, [
      this.$slots.default && (this.$createElement('div', { slot: 'default' }, Array.isArray(this.$slots.default) ? this.$slots.default : [this.$slots.default])),
      this.$createElement('div', { slot: 'loading' }, Array.isArray(this.computedLoading) ? this.computedLoading : [this.computedLoading]),
      this.$createElement('div', { slot: 'error' }, Array.isArray(this.computedError) ? this.computedError : [this.computedError]),
    ].filter(Boolean))
  },
  beforeMount(this: VueComponent): void {
    this.loadExt();
  }
}
