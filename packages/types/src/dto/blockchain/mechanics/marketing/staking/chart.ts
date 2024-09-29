import type { IPaginationDto, InputType } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

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
  merchantId?: number;
}
