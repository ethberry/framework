import type { IPaginationDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

export interface IStakingChartItemSearchDto {
  tokenType: TokenType;
  contractId: number;
}

export interface IStakingChartSearchDto extends IPaginationDto {
  contractId: number;
  deposit: IStakingChartItemSearchDto;
  reward?: IStakingChartItemSearchDto;
  emptyReward?: boolean;
  startTimestamp: string;
  endTimestamp: string;
}
