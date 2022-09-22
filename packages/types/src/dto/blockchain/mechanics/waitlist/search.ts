import type { IPaginationDto } from "@gemunion/types-collection";

export interface IWaitlistItemSearchDto extends IPaginationDto {
  listId: number;
  account: string;
}
