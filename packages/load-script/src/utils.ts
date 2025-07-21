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
export function isBoundFunction(target: unknown): boolean {
  if (!isFunction(target)) return false;
  const func = target as { name?: string; prototype?: unknown };
  return (
    typeof func.name === 'string' &&
    func.name.startsWith('bound ') &&
    !rawHasOwnProperty.call(func, 'prototype')
  );
}

// Array deduplication
export function unique<T extends PropertyKey>(array: T[]): T[] {
  return array.filter(function (this: Record<T, boolean>, item: T) {
    return item in this ? false : (this[item] = true);
  }, Object.create(null));
}
