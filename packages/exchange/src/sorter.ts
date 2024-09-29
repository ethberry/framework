import { comparator } from "@ethberry/utils";

interface IOptionsSortArr {
  sortBy?: string;
}

export const sortArrObj = <T extends Record<string, any>>(arr: Array<T>, options: IOptionsSortArr = {}) => {
  const { sortBy = "id" } = options;
  return arr.slice().sort(comparator(sortBy));
};
