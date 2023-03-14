import { IOrder, OrderStatus } from "@framework/types";

const date = new Date();

export const emptyOrder = {
  userId: 3,
  addressId: 1,
  orderStatus: OrderStatus.NOW_IN_DELIVERY,
  items: [],
  price: 0,
  priceCorrection: 0,
  createdAt: date.toISOString(),
} as unknown as IOrder;
