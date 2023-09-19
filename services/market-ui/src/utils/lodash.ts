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
