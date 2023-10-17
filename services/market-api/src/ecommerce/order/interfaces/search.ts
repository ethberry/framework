import type { ISearchDto } from "@gemunion/types-collection";
import { OrderStatus } from "@framework/types";

export interface IOrderSearchDto extends ISearchDto {
  dateRange: string;
  orderStatus: Array<OrderStatus>;
}
