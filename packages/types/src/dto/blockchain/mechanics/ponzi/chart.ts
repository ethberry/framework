import type { IPaginationDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

export interface IPonziChartItemSearchDto {
  tokenType: TokenType;
  contractId?: number;
}

export interface IPonziChartSearchDto extends IPaginationDto {
  contractId?: number;
  deposit: IPonziChartItemSearchDto;
  reward?: IPonziChartItemSearchDto;
  emptyReward?: boolean;
  startTimestamp: string;
  endTimestamp: string;
}
