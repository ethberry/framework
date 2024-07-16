export function getPropertyValue<T, K extends keyof T>(obj: T, path: K[]): T[K] | undefined {
  let result: any = obj;
  for (const key of path) {
    if (result && key in result) {
      result = result[key];
    } else {
      return undefined;
    }
  }
  return result as T[K];
}
