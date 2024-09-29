import type { ISearchDto } from "@ethberry/types-collection";

export interface IProductItemSearchDto extends ISearchDto {
  parameterIds: Array<number>;
}
