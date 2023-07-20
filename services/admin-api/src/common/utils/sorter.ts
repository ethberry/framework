export interface ISortObj {
  [key: string]: any;
}

export const sorter = (sortBy: string) => (a: ISortObj, b: ISortObj) => (a[sortBy] > b[sortBy] ? 1 : -1);

export const compare = (a1: Set<string>, a2: Set<string>) =>
  (a1 = new Set(a1)) && (a2 = new Set(a2)) && a1.size === a2.size && [...a1].every(v => a2.has(v));
