import { ISearchDto } from "@gemunionstudio/types-collection";
import { OrderStatus } from "@gemunionstudio/framework-types";

export interface IOrderSearchDto extends ISearchDto {
  dateRange: string;
  merchantId: number;
  orderStatus: Array<OrderStatus>;
}
