import type { IPaginationDto } from "@gemunion/types-collection";

export interface IRaffleTokenSearchDto extends IPaginationDto {
  roundIds: Array<number>;
}
