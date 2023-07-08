import type { IPaginationDto } from "@gemunion/types-collection";

export interface IVestingSearchDto extends IPaginationDto {
  account: string;
}
