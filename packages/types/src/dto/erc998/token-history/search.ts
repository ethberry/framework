import { IPaginationDto } from "@gemunion/types-collection";

export interface IErc998TokenHistorySearchDto extends IPaginationDto {
  erc998TokenId: number;
  collection: string;
  tokenId: string;
}
