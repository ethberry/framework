import type { IPaginationDto, InputType } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

export interface IStakingLeaderboardItemSearchDto {
  tokenType: TokenType;
  contractId?: number | InputType;
}

export interface IStakingLeaderboardSearchDto extends IPaginationDto {
  deposit: IStakingLeaderboardItemSearchDto;
  reward?: IStakingLeaderboardItemSearchDto;
  emptyReward?: boolean;
}
