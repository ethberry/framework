import type { IPaginationDto } from "@gemunion/types-collection";

export interface IEventHistorySearchDto extends IPaginationDto {
  address: string;
  tokenId: string;
}
