import type { IPaginationDto } from "@gemunion/types-collection";

export interface IWaitListItemSearchDto extends IPaginationDto {
  listId: number;
  account: string;
}
