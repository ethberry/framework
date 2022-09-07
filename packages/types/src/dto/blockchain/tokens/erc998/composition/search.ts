import type { IPaginationDto } from "@gemunion/types-collection";

export interface ICompositionSearchDto extends IPaginationDto {
  parentIds: Array<number>;
  childIds: Array<number>;
}
