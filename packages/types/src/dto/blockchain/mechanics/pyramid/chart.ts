import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

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
