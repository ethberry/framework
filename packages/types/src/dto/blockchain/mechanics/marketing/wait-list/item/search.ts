import type { IPaginationDto } from "@ethberry/types-collection";

export interface IWaitListItemSearchDto extends IPaginationDto {
  listIds: Array<number>;
  account: string;
  merchantId: number;
}
