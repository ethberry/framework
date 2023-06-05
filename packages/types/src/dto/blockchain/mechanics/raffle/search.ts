import type { IPaginationDto } from "@gemunion/types-collection";

export interface IRaffleTicketSearchDto extends IPaginationDto {
  roundIds: Array<number>;
}
