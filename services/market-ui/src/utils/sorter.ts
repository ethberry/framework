export type ISortObj = Record<string, any>;

export const sorter = (sortBy: string) => (a: ISortObj, b: ISortObj) => (a[sortBy] > b[sortBy] ? 1 : -1);
