import { IPaginationDto } from "@gemunion/types-collection";

export interface ITokenHistorySearchDto extends IPaginationDto {
  token: string;
  tokenId: string;
}
