import { ISearchDto } from "@gemunion/types-collection";
import { OrderStatus } from "@framework/types";

export interface IOrderSearchDto extends ISearchDto {
  dateRange: string;
  merchantId: number;
  orderStatus: Array<OrderStatus>;
}
