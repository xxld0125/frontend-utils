export const rawWindow = window;
export const rawDefineProperty = Object.defineProperty;
export const rawDefineProperties = Object.defineProperties;
export const rawHasOwnProperty = Object.prototype.hasOwnProperty;

// is function
export function isFunction(target: unknown): boolean {
  return typeof target === 'function';
}

// is Boolean
export function isBoolean(target: unknown): target is boolean {
  return typeof target === 'boolean';
}

// is bind function
export function isBoundFunction(target: any): boolean {
  return isFunction(target) && target.name.startsWith('bound ') && !rawHasOwnProperty.call(target, 'prototype');
}

// Array deduplication
export function unique(array: any[]): any[] {
  return array.filter(function (this: Record<PropertyKey, boolean>, item) {
    return item in this ? false : (this[item] = true);
  }, Object.create(null));
}
