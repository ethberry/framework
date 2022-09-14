import type { IPaginationDto } from "@gemunion/types-collection";

import { TokenType } from "../../../../entities";

export interface IPyramidLeaderboardItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IPyramidLeaderboardSearchDto extends IPaginationDto {
  deposit: IPyramidLeaderboardItemSearchDto;
  reward: IPyramidLeaderboardItemSearchDto;
}
