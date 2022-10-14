import type { IPaginationDto } from "@gemunion/types-collection";

export interface IBreedHistorySearchDto extends IPaginationDto {
  childIds?: Array<number>;
  matronIds?: Array<number>;
  siresIds?: Array<number>;
}
