import {ISearchDto} from "@trejgun/types-collection";
import {OrderStatus} from "@trejgun/solo-types";

export interface IOrderSearchDto extends ISearchDto {
  dateRange: string;
  merchantId: number;
  orderStatus: Array<OrderStatus>;
}
