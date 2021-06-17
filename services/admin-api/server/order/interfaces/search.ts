import {OrderStatus} from "@trejgun/solo-types";

export interface IOrderSearchDto {
  dateRange: string;
  merchantId: number;
  orderStatus: Array<OrderStatus>;
}
