import type { IIdDateBase } from "@gemunion/types-collection";

import type { IOrderItem } from "./order-item";
import type { IAddress } from "./address";
import type { IMerchant, IUser } from "../infrastructure";

export enum OrderStatus {
  NEW = "NEW",
  SCHEDULED = "SCHEDULED",
  NOW_IN_DELIVERY = "NOW_IN_DELIVERY",
  DELIVERED = "DELIVERED",
  CLOSED = "CLOSED",
  CANCELED = "CANCELED",
}

export interface IOrder extends IIdDateBase {
  orderItems: Array<IOrderItem>;
  orderStatus: OrderStatus;
  addressId: number;
  address?: IAddress;
  merchantId: number;
  merchant?: IMerchant;
  userId: number;
  user?: IUser;
  isArchived: boolean;
}
