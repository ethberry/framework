import type { IPaginationDto } from "@ethberry/types-collection";

export interface ILotteryTicketTokenSearchDto extends IPaginationDto {
  roundIds: Array<number>;
}
