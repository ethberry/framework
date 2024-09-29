import type { ISearchDto } from "@ethberry/types-collection";

import { OrderStatus } from "../../../entities";

export interface IOrderSearchDto extends ISearchDto {
  dateRange: string;
  orderStatus: Array<OrderStatus>;
  merchantId: number;
  isArchived: boolean;
}
