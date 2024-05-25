export function getNestedValueFromObject<T = any>(object: any, path: string): T | undefined {
  return path.split(".").reduce((o, p) => {
    return o?.[p] as T;
  }, object) as T | undefined;
}
