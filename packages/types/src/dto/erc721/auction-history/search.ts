import { IPaginationDto } from "@gemunion/types-collection";

export interface IErc721AuctionHistorySearchDto extends IPaginationDto {
  erc721AuctionId: number;
  collection: string;
  tokenId: string;
}
