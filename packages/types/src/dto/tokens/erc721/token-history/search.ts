import { IPaginationDto } from "@gemunion/types-collection";

export interface IErc721TokenHistorySearchDto extends IPaginationDto {
  erc721TokenId: number;
  collection: string;
  tokenId: string;
}
