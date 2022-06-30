import { IPaginationDto } from "@gemunion/types-collection";

export interface ITokenHistorySearchDto extends IPaginationDto {
  erc998TokenId: number;
  collection: string;
  tokenId: string;
}
