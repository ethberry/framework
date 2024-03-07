import type { IPaginationDto } from "@gemunion/types-collection";

export interface IRaffleTokenSearchDto extends IPaginationDto {
  account: string;
  roundIds: Array<number>;
}
