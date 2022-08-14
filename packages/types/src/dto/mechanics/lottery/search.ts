import { IPaginationDto } from "@gemunion/types-collection";

export interface ILotteryTicketSearchDto extends IPaginationDto {
  roundIds: Array<number>;
}
