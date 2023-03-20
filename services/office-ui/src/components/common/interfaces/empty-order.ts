import { IOrder, OrderStatus } from "@framework/types";

const date = new Date();

export const emptyOrder = {
  userId: 3,
  addressId: 1,
  orderStatus: OrderStatus.NOW_IN_DELIVERY,
  items: [],
  createdAt: date.toISOString(),
} as unknown as IOrder;
