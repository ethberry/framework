import { IIdBase } from "@gemunion/types-collection";

import { IUser } from "./user";
import { IMerchant } from "./merchant";
import { IProduct } from "./product";

export enum OrderStatus {
  NEW = "NEW",
  CLOSED = "CLOSED",
  CANCELED = "CANCELED",
}

export interface IOrder extends IIdBase {
  orderStatus: OrderStatus;
  userId: number;
  user?: IUser;
  merchantId: number;
  merchant?: IMerchant;
  productId: number;
  product?: IProduct;
  price: number;
}
