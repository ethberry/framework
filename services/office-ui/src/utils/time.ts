import { DurationUnit } from "@framework/types";

export interface IDuration {
  durationAmount: number;
  durationUnit: DurationUnit;
}

export const formatDuration = (props: IDuration) => {
  const { durationAmount, durationUnit } = props;

  switch (durationUnit) {
    case DurationUnit.YEAR:
      return durationAmount * 60 * 60 * 24 * 365;
    case DurationUnit.MONTH:
      return durationAmount * 60 * 60 * 24 * 30;
    case DurationUnit.WEEK:
      return durationAmount * 60 * 60 * 24 * 7;
    case DurationUnit.DAY:
      return durationAmount * 60 * 60 * 24;
    case DurationUnit.HOUR:
      return durationAmount * 60 * 60;
    case DurationUnit.MINUTE:
    default:
      return durationAmount * 60;
  }
};

export const normalizeDuration = (props: IDuration) => {
  const { durationAmount, durationUnit } = props;

  switch (durationUnit) {
    case DurationUnit.YEAR:
      return durationAmount / 60 / 60 / 24 / 365;
    case DurationUnit.MONTH:
      return durationAmount / 60 / 60 / 24 / 30;
    case DurationUnit.WEEK:
      return durationAmount / 60 / 60 / 24 / 7;
    case DurationUnit.DAY:
      return durationAmount / 60 / 60 / 24;
    case DurationUnit.HOUR:
      return durationAmount / 60 / 60;
    case DurationUnit.MINUTE:
    default:
      return durationAmount / 60;
  }
};
