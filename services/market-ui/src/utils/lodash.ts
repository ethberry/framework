const transform = (obj: Record<string, any>, predicate: (value: any, key: string) => boolean) => {
  return Object.keys(obj).reduce<Record<string, any>>((memo, key) => {
    if (predicate(obj[key], key)) {
      memo[key] = obj[key];
    }
    return memo;
  }, {});
};

export const omit = (obj: Record<string, any>, items: Array<string>) =>
  transform(obj, (value, key) => !items.includes(key));

export const pick = (obj: Record<string, any>, items: Array<string>) =>
  transform(obj, (value, key) => items.includes(key));

export const deepClone = <T = any>(target: T): T => {
  if (target === null) {
    return target;
  }
  if (typeof target !== "object") {
    return target;
  }

  if (Array.isArray(target)) {
    const cloneArray: any[] = [];
    for (let i = 0; i < (target as any[]).length; i++) {
      cloneArray[i] = deepClone(target[i]);
    }
    return cloneArray as T;
  }

  const cloneObject: Record<string, any> = {};
  for (const key in target) {
    if (Object.prototype.hasOwnProperty.call(target, key)) {
      cloneObject[key] = deepClone((target as Record<string, any>)[key]);
    }
  }

  return cloneObject as T;
};
