import { InputType } from "@ethberry/types-collection";
import type { IPaginationDto } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

export interface IPonziLeaderboardItemSearchDto {
  tokenType: TokenType;
  contractId?: number | InputType;
}

export interface IPonziLeaderboardSearchDto extends IPaginationDto {
  deposit: IPonziLeaderboardItemSearchDto;
  reward: IPonziLeaderboardItemSearchDto;
}
