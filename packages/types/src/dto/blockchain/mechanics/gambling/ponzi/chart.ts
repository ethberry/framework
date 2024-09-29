import type { IPaginationDto, InputType } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

export interface IPonziChartItemSearchDto {
  tokenType: TokenType;
  contractId?: number | InputType;
}

export interface IPonziChartSearchDto extends IPaginationDto {
  contractId?: number | InputType;
  deposit: IPonziChartItemSearchDto;
  reward: IPonziChartItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}
