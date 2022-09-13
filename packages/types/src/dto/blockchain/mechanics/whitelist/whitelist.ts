import type { IPaginationDto } from "@gemunion/types-collection";

export interface IWhitelistSearchDto extends IPaginationDto {
  account: string;
}
