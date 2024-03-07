import type { IPaginationDto } from "@gemunion/types-collection";

export interface ILotteryTokenSearchDto extends IPaginationDto {
  roundIds: Array<number>;
}
