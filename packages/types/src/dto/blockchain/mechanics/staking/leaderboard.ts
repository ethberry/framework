import type { IPaginationDto } from "@gemunion/types-collection";

import { TokenType } from "../../../../entities";

export interface IStakingLeaderboardItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IStakingLeaderboardSearchDto extends IPaginationDto {
  deposit: IStakingLeaderboardItemSearchDto;
  reward: IStakingLeaderboardItemSearchDto;
}
