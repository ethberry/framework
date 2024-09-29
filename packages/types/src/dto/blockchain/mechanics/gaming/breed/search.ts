import type { IPaginationDto } from "@ethberry/types-collection";

export interface IBreedHistorySearchDto extends IPaginationDto {
  childIds?: Array<number>;
  matronIds?: Array<number>;
  siresIds?: Array<number>;
}
