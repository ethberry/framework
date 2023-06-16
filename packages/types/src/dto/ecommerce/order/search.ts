import { ISearchDto } from "@gemunion/types-collection";

import { OrderStatus } from "../../../entities";

export interface IOrderSearchDto extends ISearchDto {
  dateRange: string;
  orderStatus: Array<OrderStatus>;
  merchantId: number;
  isArchived: boolean;
}
