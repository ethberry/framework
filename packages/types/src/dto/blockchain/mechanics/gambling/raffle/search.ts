import type { IPaginationDto } from "@ethberry/types-collection";

export interface IRaffleTicketTokenSearchDto extends IPaginationDto {
  account: string;
  roundIds: Array<number>;
}
