import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

export interface IPonziChartItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IPonziChartSearchDto extends ISearchDto {
  deposit: IPonziChartItemSearchDto;
  reward?: IPonziChartItemSearchDto;
  emptyReward?: boolean;
  startTimestamp: string;
  endTimestamp: string;
}
