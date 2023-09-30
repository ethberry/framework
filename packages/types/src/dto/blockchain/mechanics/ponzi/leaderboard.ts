import type { IPaginationDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

export interface IPonziLeaderboardItemSearchDto {
  tokenType: TokenType;
  contractId?: number;
}

export interface IPonziLeaderboardSearchDto extends IPaginationDto {
  deposit: IPonziLeaderboardItemSearchDto;
  reward: IPonziLeaderboardItemSearchDto;
}
