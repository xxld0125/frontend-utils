import ProxyPolyfillBuilder from 'proxy-polyfill/src/proxy';

import bindFunctionToRawWindow from './bind_function';
import { isFunction, rawDefineProperty, rawHasOwnProperty, rawWindow, unique } from './utils';

const proxyPolyfill = ProxyPolyfillBuilder();

export type MicroAppWindowDataType = Record<PropertyKey, any>;
export type MicroAppWindowType = Window & MicroAppWindowDataType;
type microAppWindowType = Window & any;

/**
 * 可以逃逸到原生窗口的静态属性列表
 * 这些属性会被直接设置到原生 window 对象上
 */
const staticEscapeProperties: PropertyKey[] = ['System', '_cjsWrapper'];

/**
 * 只能分配给原生窗口的属性列表
 * 这些属性的设置操作会直接作用于原生 window
 */
const escapeSetterKeyList: PropertyKey[] = ['location'];

/**
 * 全局属性列表
 * 这些属性会被直接设置到原生 window 对象上
 */
const globalPropertyList: PropertyKey[] = ['window', 'self', 'globalThis'];

/**
 * 沙箱类 - 为微应用提供隔离的 JavaScript 执行环境
 *
 * 主要功能：
 * 1. 创建代理窗口，拦截对全局对象的访问
 * 2. 隔离微应用的全局变量，防止污染宿主环境
 * 3. 管理属性的逃逸策略，某些属性可以穿透沙箱
 * 4. 提供完整的 window 对象 API 代理
 */
export default class Sandbox {
  // 记录注入到沙箱中的所有属性键
  public injectedKeys = new Set<PropertyKey>();
  // 作用域属性列表，这些属性只在沙箱内部可见
  private readonly scopeProperties: PropertyKey[] = [];
  // 代理窗口对象，微应用实际操作的 window
  proxyWindow: WindowProxy;
  // 微应用窗口对象，作为代理的目标对象
  microAppWindow = {} as MicroAppWindowType;
  // 沙箱激活状态
  private readonly active = true;
  // 可以逃逸到原生窗口的属性列表
  private readonly escapeProperties: PropertyKey[] = [];
  // 记录已逃逸的属性键
  private readonly escapeKeys = new Set<PropertyKey>();

  constructor() {
    // 创建代理窗口
    this.proxyWindow = this.createProxyWindow();
    // 初始化微应用窗口
    this.initMicroAppWindow(this.microAppWindow);
  }

  /**
   * 创建代理窗口
   * 使用 Proxy 拦截对 window 对象的所有操作
   */
  createProxyWindow(): WindowProxy {
    // 用于记录属性描述符的目标映射
    const descriptorTargetMap = new Map<PropertyKey, 'target' | 'rawWindow'>();

    // 选择合适的 Proxy 实现（原生或 polyfill）
    const Proxy = window.Proxy ? window.Proxy : proxyPolyfill;

    return new Proxy(this.microAppWindow, {
      /**
       * 拦截属性读取操作
       * 优先从沙箱目标对象读取，不存在则从原生 window 读取
       */
      get: (target: microAppWindowType, key: PropertyKey): unknown => {
        // 如果沙箱目标对象有该属性，直接返回
        if (Reflect.has(target, key)) return Reflect.get(target, key);

        // 从原生 window 获取属性值
        const rawValue = Reflect.get(rawWindow, key);

        // 如果是函数, 需要绑定到原生 window 上
        return isFunction(rawValue) ? bindFunctionToRawWindow(rawWindow, rawValue) : rawValue;
      },

      /**
       * 拦截属性设置操作
       * 根据不同策略决定属性设置的目标位置
       */
      set: (target: microAppWindowType, key: PropertyKey, value: unknown): boolean => {
        if (this.active) {
          // 只能设置到原生 window 的属性
          if (escapeSetterKeyList.includes(key)) {
            Reflect.set(rawWindow, key, value);
          } else if (
            // 如果目标对象没有该属性，但原生 window 有，且不在作用域属性中
            !rawHasOwnProperty.call(target, key) &&
            rawHasOwnProperty.call(rawWindow, key) &&
            !this.scopeProperties.includes(key)
          ) {
            // 复制原生 window 的属性描述符到沙箱目标对象
            const descriptor = Object.getOwnPropertyDescriptor(rawWindow, key);
            const { configurable, enumerable, writable, set } = descriptor!;

            rawDefineProperty(target, key, {
              value,
              configurable: configurable ?? true,
              enumerable: enumerable ?? true,
              writable: writable ?? !!set
            });

            this.injectedKeys.add(key);
          } else {
            // 普通属性设置到沙箱目标对象
            Reflect.set(target, key, value);
            this.injectedKeys.add(key);
          }

          // 处理需要逃逸的属性
          if (
            (this.escapeProperties.includes(key) ||
              (staticEscapeProperties.includes(key) && !Reflect.has(rawWindow, key))) &&
            !this.scopeProperties.includes(key)
          ) {
            // 同时设置到原生 window
            Reflect.set(rawWindow, key, value);
            this.escapeKeys.add(key);
          }
        }

        return true;
      },

      /**
       * 拦截 in 操作符
       * 检查属性是否存在于沙箱或原生 window 中
       */
      has: (target: microAppWindowType, key: PropertyKey): boolean => {
        // 作用域属性只在沙箱内查找
        if (this.scopeProperties.includes(key)) return key in target;
        // 其他属性在沙箱和原生 window 中都查找
        return key in target || key in rawWindow;
      },

      /**
       * 拦截 Object.getOwnPropertyDescriptor 操作
       * 返回属性的描述符信息
       */
      getOwnPropertyDescriptor: (target: microAppWindowType, key: PropertyKey): PropertyDescriptor | undefined => {
        // 优先从沙箱目标对象获取
        if (rawHasOwnProperty.call(target, key)) {
          descriptorTargetMap.set(key, 'target');
          return Object.getOwnPropertyDescriptor(target, key);
        }

        // 从原生 window 获取
        if (rawHasOwnProperty.call(rawWindow, key)) {
          descriptorTargetMap.set(key, 'rawWindow');
          const descriptor = Object.getOwnPropertyDescriptor(rawWindow, key);
          // 确保描述符可配置，以便后续操作
          if (descriptor && !descriptor.configurable) {
            descriptor.configurable = true;
          }
          return descriptor;
        }

        return undefined;
      },

      /**
       * 拦截 Object.defineProperty 操作
       * 根据属性来源决定定义位置
       */
      defineProperty: (target: microAppWindowType, key: PropertyKey, value: PropertyDescriptor): boolean => {
        const from = descriptorTargetMap.get(key);
        // 如果属性来自原生 window，定义到原生 window
        if (from === 'rawWindow') {
          return Reflect.defineProperty(rawWindow, key, value);
        }
        // 否则定义到沙箱目标对象
        return Reflect.defineProperty(target, key, value);
      },

      /**
       * 拦截 Object.getOwnPropertyNames 操作
       * 返回所有属性名的合并结果
       */
      ownKeys: (target: microAppWindowType): Array<string | symbol> =>
        unique<string | symbol>(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target))),

      /**
       * 拦截 delete 操作
       * 删除沙箱中的属性，并可能清理相关记录
       */
      deleteProperty: (target: microAppWindowType, key: PropertyKey): boolean => {
        if (rawHasOwnProperty.call(target, key)) {
          // 清理注入键记录
          if (this.injectedKeys.has(key)) {
            this.injectedKeys.delete(key);
          }
          // 如果属性已逃逸，也从原生 window 删除
          if (this.escapeKeys.has(key)) {
            Reflect.deleteProperty(rawWindow, key);
          }
          return Reflect.deleteProperty(target, key);
        }
        return true;
      }
    });
  }

  /**
   * 初始化微应用窗口
   * 为微应用窗口注入必要的全局属性和方法
   * @param microAppWindow 微应用窗口对象
   */
  private initMicroAppWindow(microAppWindow: microAppWindowType): void {
    // 添加特殊标识，表明这是一个微应用窗口
    microAppWindow.__EXT_MICRO_APP_WINDOW__ = microAppWindow;

    // 重写 hasOwnProperty 方法，使其能够检查沙箱和原生 window
    microAppWindow.hasOwnProperty = (key: PropertyKey): boolean =>
      rawHasOwnProperty.call(microAppWindow, key) || rawHasOwnProperty.call(rawWindow, key);

    // 设置与原生窗口的映射属性
    this.setMappingPropertiesWithRawDescriptor(microAppWindow);
  }

  /**
   * 设置与原生窗口相关的映射属性
   * 主要处理 top、parent、window、self、globalThis 等全局引用
   * @param microAppWindow 微应用窗口对象
   */
  private setMappingPropertiesWithRawDescriptor(microAppWindow: microAppWindowType): void {
    let topValue: Window, parentValue: Window;

    // 判断是否在 iframe 中
    if (rawWindow === rawWindow.parent) {
      // 不在 iframe 中，top 和 parent 都指向代理窗口
      topValue = parentValue = this.proxyWindow;
    } else {
      // 在 iframe 中，保持原有的层级关系
      topValue = rawWindow.top as Window;
      parentValue = rawWindow.parent;
    }

    // 定义 top 属性，指向顶层窗口
    rawDefineProperty(microAppWindow, 'top', this.createDescriptorForMicroAppWindow('top', topValue));

    // 定义 parent 属性，指向父窗口
    rawDefineProperty(microAppWindow, 'parent', this.createDescriptorForMicroAppWindow('parent', parentValue));

    // 定义全局属性，都指向代理窗口以保持沙箱隔离
    globalPropertyList.forEach((key: PropertyKey) => {
      rawDefineProperty(microAppWindow, key, this.createDescriptorForMicroAppWindow(key, this.proxyWindow));
    });
  }

  /**
   * 为微应用窗口创建属性描述符
   * 基于原生 window 的描述符创建，确保行为一致性
   * @param key 属性键
   * @param value 属性值
   * @returns 属性描述符
   */
  private createDescriptorForMicroAppWindow(key: PropertyKey, value: unknown): PropertyDescriptor {
    // 获取原生 window 中对应属性的描述符，如果不存在则使用默认值
    const {
      configurable = true,
      enumerable = true,
      writable,
      set
    } = Object.getOwnPropertyDescriptor(rawWindow, key) ?? { writable: true };

    const descriptor: PropertyDescriptor = {
      value,
      configurable,
      enumerable,
      writable: writable ?? !!set
    };

    return descriptor;
  }
}
