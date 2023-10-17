import type { IPaginationDto, InputType } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

export interface IPonziChartItemSearchDto {
  tokenType: TokenType;
  contractId?: number | InputType;
}

export interface IPonziChartSearchDto extends IPaginationDto {
  contractId?: number | InputType;
  deposit: IPonziChartItemSearchDto;
  reward?: IPonziChartItemSearchDto;
  emptyReward?: boolean;
  startTimestamp: string;
  endTimestamp: string;
}
