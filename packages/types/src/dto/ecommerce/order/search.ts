import { ISearchDto } from "@gemunion/types-collection";

import { OrderStatus } from "../../../entities";

export interface IOrderSearchDto extends ISearchDto {
  dateRange: string;
  merchantId: number;
  orderStatus: Array<OrderStatus>;
  isArchived: boolean;
}
