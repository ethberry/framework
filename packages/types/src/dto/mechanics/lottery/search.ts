import { IPaginationDto } from "@gemunion/types-collection";

export interface ILotteryRoundSearchDto extends IPaginationDto {
  roundIds: Array<number>;
}

export interface ILotteryTicketSearchDto extends IPaginationDto {
  roundIds: Array<number>;
}
