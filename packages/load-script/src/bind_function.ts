import { isBoolean, isBoundFunction, rawDefineProperty } from './utils';

/**
 * 检查函数是否为绑定函数
 * @param value 要检查的函数对象，包含 __MICRO_APP_IS_BOUND_FUNCTION__ 缓存属性
 * @returns 如果是绑定函数返回 true，否则返回 false
 */
function isBoundedFunction(value: CallableFunction & { __MICRO_APP_IS_BOUND_FUNCTION__: boolean }): boolean {
  // 如果已经缓存了结果，直接返回缓存值
  if (isBoolean(value.__MICRO_APP_IS_BOUND_FUNCTION__)) return value.__MICRO_APP_IS_BOUND_FUNCTION__;
  // 计算并缓存结果
  return (value.__MICRO_APP_IS_BOUND_FUNCTION__ = isBoundFunction(value));
}

/**
 * 检查函数是否为构造函数
 * @param value 要检查的函数对象，包含 __MICRO_APP_IS_CONSTRUCTOR__ 缓存属性
 * @returns 如果是构造函数返回 true，否则返回 false
 */
function isConstructor(value: FunctionConstructor & { __MICRO_APP_IS_CONSTRUCTOR__: boolean }): boolean {
  // 如果已经缓存了结果，直接返回缓存值
  if (isBoolean(value.__MICRO_APP_IS_CONSTRUCTOR__)) return value.__MICRO_APP_IS_CONSTRUCTOR__;

  // 获取函数的字符串表示形式
  const valueStr = value.toString();

  // 通过多种方式判断是否为构造函数：
  // 1. 检查原型链：函数的原型的构造函数是否指向自身，且原型上有多个属性
  // 2. 检查函数名：是否以大写字母开头的 function
  // 3. 检查类语法：是否以 class 关键字开头
  const result =
    (value.prototype?.constructor === value && Object.getOwnPropertyNames(value.prototype).length > 1) ||
    /^function\s+[A-Z]/.test(valueStr) ||
    /^class\s+/.test(valueStr);

  // 缓存并返回结果
  return (value.__MICRO_APP_IS_CONSTRUCTOR__ = result);
}

/**
 * 将函数绑定到原始窗口对象
 * 这个函数用于微前端场景中，确保子应用中的函数能够正确访问主应用的 window 对象
 *
 * @param rawWindow 原始的 window 对象（通常是主应用的 window）
 * @param value 需要绑定的函数
 * @returns 绑定后的函数或原函数（如果不需要绑定）
 */
export default function bindFunctionToRawWindow(rawWindow: Window, value: any): unknown {
  // 如果已经绑定过，直接返回缓存的绑定函数
  if (value.__MICRO_APP_BOUND_WINDOW_FUNCTION__) return value.__MICRO_APP_BOUND_WINDOW_FUNCTION__;

  // 只有非构造函数且非绑定函数才需要重新绑定
  // 1.构造函数主要通过 new 关键字调用，此时 this 自动指向新创建的实例对象
  // 即使绑定到不同的 window，构造函数的行为也不会改变
  // 2.已绑定的函数无法再次绑定到不同的上下文
  if (!isConstructor(value) && !isBoundedFunction(value)) {
    // 使用 bind 方法将函数绑定到原始窗口对象
    const bindRawWindowValue = value.bind(rawWindow);

    // 复制原函数的所有可枚举属性到绑定后的函数
    for (const key in value) {
      bindRawWindowValue[key] = value[key];
    }

    // 如果原函数有 prototype 属性，需要特殊处理
    // 因为 bind 后的函数不会自动复制 prototype
    if (Object.prototype.hasOwnProperty.call(value, 'prototype')) {
      rawDefineProperty(bindRawWindowValue, 'prototype', {
        value: value.prototype,
        configurable: true,
        enumerable: false,
        writable: true
      });
    }

    // 缓存绑定后的函数并返回
    return (value.__MICRO_APP_BOUND_WINDOW_FUNCTION__ = bindRawWindowValue);
  }

  // 构造函数或已绑定的函数直接返回原值
  return value;
}
