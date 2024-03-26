export function objectToQueryString(obj: Record<string, any>) {
  const queryParams = new URLSearchParams();
  for (const key in obj) {
    if (obj[key]) {
      queryParams.append(key, obj[key]);
    }
  }
  return `?${queryParams.toString()}`;
}
