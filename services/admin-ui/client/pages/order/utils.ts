import {endOfDay, startOfDay} from "date-fns";

export const parseDateRange = (dateRange = ""): [Date, Date] => {
  const [start, end] = dateRange ? dateRange.split("/").map(date => new Date(date)) : [new Date(), new Date()];
  return [startOfDay(start), endOfDay(end)];
};

export const stringifyDateRange = (dateRange: [Date, Date] = parseDateRange()): string => {
  return !dateRange.some((date: Date) => date === null)
    ? dateRange.map((date: Date) => date.toISOString()).join("/")
    : "";
};
