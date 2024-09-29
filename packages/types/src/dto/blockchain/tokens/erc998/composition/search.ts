import type { ISearchDto } from "@ethberry/types-collection";

export interface ICompositionSearchDto extends ISearchDto {
  parentIds: Array<number>;
  childIds: Array<number>;

  merchantId?: number;
}
