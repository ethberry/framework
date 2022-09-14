import type { ISearchDto } from "@gemunion/types-collection";

import { TokenType } from "../../../../entities";

export interface IPyramidChartItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IPyramidChartSearchDto extends ISearchDto {
  deposit: IPyramidChartItemSearchDto;
  reward: IPyramidChartItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}
