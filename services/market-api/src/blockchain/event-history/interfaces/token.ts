import type { IPaginationDto } from "@ethberry/types-collection";

export interface IEventHistoryTokenSearchDto extends IPaginationDto {
  tokenId: string;
}
