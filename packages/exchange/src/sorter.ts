import type { ISortDto } from "@gemunion/types-collection";

export interface ISortObj {
  [key: string]: any;
}

export const sorter = (sortBy: string) => (a: ISortObj, b: ISortObj) => (a[sortBy] > b[sortBy] ? 1 : -1);

export const getSortOrder = <T>(entityName: string, order?: ISortDto<T>[]) => {
  return order?.length ? { [`${entityName}.${String(order[0].field)}`]: order[0].sort.toUpperCase() } : {};
};

interface IOptionsSortArr {
  sortBy?: string;
}

export const sortArrObj = <T extends ISortObj>(arr: Array<T>, options: IOptionsSortArr = {}) => {
  const { sortBy = "id" } = options;
  return arr.slice().sort(sorter(sortBy));
};
