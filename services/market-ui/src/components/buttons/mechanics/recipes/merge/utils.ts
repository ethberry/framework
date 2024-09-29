import { comparator } from "@ethberry/utils";

export const arrayComparator = <T extends Record<string, any>>(arr: Array<T>, key = "id") => {
  return arr.slice().sort(comparator(key));
};
