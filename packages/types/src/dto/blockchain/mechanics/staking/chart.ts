import type { IPaginationDto, InputType } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

export interface IStakingChartItemSearchDto {
  tokenType: TokenType;
  contractId?: number | InputType;
}

export interface IStakingChartSearchDto extends IPaginationDto {
  contractId?: number | InputType;
  deposit: IStakingChartItemSearchDto;
  reward?: IStakingChartItemSearchDto;
  emptyReward?: boolean;
  startTimestamp: string;
  endTimestamp: string;
}
