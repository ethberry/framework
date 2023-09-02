import type { IPaginationDto } from "@gemunion/types-collection";

export interface IWaitListItemSearchDto extends IPaginationDto {
  listIds: Array<number>;
  account: string;
  merchantId: number;
}
