import type { IPaginationDto } from "@gemunion/types-collection";

export interface IRaffleTicketTokenSearchDto extends IPaginationDto {
  account: string;
  roundIds: Array<number>;
}
