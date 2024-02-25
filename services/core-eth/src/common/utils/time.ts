import { DurationUnit } from "@framework/types";

export const getDurationUnit = (period: number): DurationUnit => {
  const secondsPerMinute = 60;
  const secondsPerHour = secondsPerMinute * 60;
  const secondsPerDay = secondsPerHour * 24;
  const secondsPerWeek = secondsPerDay * 7;
  const secondsPerMonth = secondsPerDay * 30;
  const secondsPerYear = secondsPerDay * 365;

  if (period % secondsPerYear === 0) {
    return DurationUnit.YEAR;
  } else if (period % secondsPerMonth === 0) {
    return DurationUnit.MONTH;
  } else if (period % secondsPerWeek === 0) {
    return DurationUnit.WEEK;
  } else if (period % secondsPerDay === 0) {
    return DurationUnit.DAY;
  } else if (period % secondsPerHour === 0) {
    return DurationUnit.HOUR;
  } else {
    return DurationUnit.MINUTE;
  }
};
