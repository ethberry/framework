import type { IOrder } from "@framework/types";
import { OrderStatus } from "@framework/types";
import { DateRange } from "@mui/x-date-pickers-pro";
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

export const parseDateRange = (dateRange = ""): DateRange<Date> => {
  const [start, end] = dateRange ? dateRange.split("/").map(date => new Date(date)) : [new Date(), new Date()];
  return [startOfDay(start), endOfDay(end)];
};

export const stringifyDateRange = (dateRange: DateRange<Date> = parseDateRange()): string => {
  return !dateRange.some((date: Date | null) => date === null)
    ? dateRange.map((date: Date | null) => date!.toISOString()).join("/")
    : "";
};
