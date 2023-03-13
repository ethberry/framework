import type { IIdDateBase } from "@gemunion/types-collection";

import { IOrderItem } from "./order-item";
import { IAddress } from "./address";
import { IMerchant, IUser } from "../infrastructure";

export enum OrderStatus {
  NEW = "NEW",
  SCHEDULED = "SCHEDULED",
  NOW_IN_DELIVERY = "NOW_IN_DELIVERY",
  DELIVERED = "DELIVERED",
  CLOSED = "CLOSED",
  CANCELED = "CANCELED",
}

export interface IOrder extends IIdDateBase {
  items: Array<IOrderItem>;
  orderStatus: OrderStatus;
  addressId: number;
  address?: IAddress;
  userId: number;
  user?: IUser;
  merchantId: number;
  merchant?: IMerchant;
}
