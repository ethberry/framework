import type { ISearchDto } from "@gemunion/types-collection";

import { TokenType } from "../../../../entities";

export interface IStakingChartItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IStakingChartSearchDto extends ISearchDto {
  deposit: IStakingChartItemSearchDto;
  reward: IStakingChartItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}
