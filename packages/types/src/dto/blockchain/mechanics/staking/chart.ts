import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

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
