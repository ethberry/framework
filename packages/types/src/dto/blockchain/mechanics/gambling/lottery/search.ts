import type { IPaginationDto } from "@gemunion/types-collection";

export interface ILotteryTicketTokenSearchDto extends IPaginationDto {
  roundIds: Array<number>;
}
