import type { IPaginationDto } from "@gemunion/types-collection";

export interface IEventHistoryTokenSearchDto extends IPaginationDto {
  address: string;
  tokenId: string;
}