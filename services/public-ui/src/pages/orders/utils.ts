import { IOrder, OrderStatus } from "@gemunion/framework-types";
import { endOfDay, startOfDay } from "date-fns";

type OrdersObject = Record<OrderStatus, Array<IOrder>>;

export const groupOrdersByStatus = (array: Array<IOrder>): OrdersObject => {
  return array.reduce((memo, order) => {
    if (!memo[order.orderStatus]) {
      memo[order.orderStatus] = [];
    }
    memo[order.orderStatus].push(order);
    return memo;
  }, {} as OrdersObject);
};

export const parseDateRange = (dateRange = ""): [Date, Date] => {
  const [start, end] = dateRange ? dateRange.split("/").map(date => new Date(date)) : [new Date(), new Date()];
  return [startOfDay(start), endOfDay(end)];
};

export const stringifyDateRange = (dateRange: [Date, Date] = parseDateRange()): string => {
  return !dateRange.some((date: Date) => date === null)
    ? dateRange.map((date: Date) => date.toISOString()).join("/")
    : "";
};
