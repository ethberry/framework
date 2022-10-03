import type { ISearchDto } from "@gemunion/types-collection";

export interface ICompositionSearchDto extends ISearchDto {
  parentIds: Array<number>;
  childIds: Array<number>;
}
