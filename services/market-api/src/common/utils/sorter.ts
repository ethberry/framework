import type { ISortDto } from "@gemunion/types-collection";

export const getSortOrder = <T>(entityName: string, order?: ISortDto<T>[]) => {
  return order?.length ? { [`${entityName}.${String(order[0].field)}`]: order[0].sort.toUpperCase() } : {};
};
