import { IPaginationDto } from "@gemunion/types-collection";

export interface IUniTokenHistorySearchDto extends IPaginationDto {
  erc998TokenId: number;
  collection: string;
  tokenId: string;
}
