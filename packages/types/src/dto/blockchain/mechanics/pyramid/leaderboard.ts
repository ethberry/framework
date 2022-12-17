import type { IPaginationDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

export interface IPyramidLeaderboardItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IPyramidLeaderboardSearchDto extends IPaginationDto {
  deposit: IPyramidLeaderboardItemSearchDto;
  reward: IPyramidLeaderboardItemSearchDto;
}
