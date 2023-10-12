import type { IPaginationDto, InputType } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

export interface IStakingLeaderboardItemSearchDto {
  tokenType: TokenType;
  contractId?: number | InputType;
}

export interface IStakingLeaderboardSearchDto extends IPaginationDto {
  deposit: IStakingLeaderboardItemSearchDto;
  reward: IStakingLeaderboardItemSearchDto;
}
