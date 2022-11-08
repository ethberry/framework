import { DurationUnit } from "@framework/types";

export interface IDuration {
  durationAmount: number;
  durationUnit: DurationUnit;
}

export const formatDuration = (props: IDuration) => {
  const { durationAmount, durationUnit } = props;

  switch (durationUnit) {
    case DurationUnit.DAY:
      return durationAmount / 86400;
    case DurationUnit.HOUR:
      return durationAmount / 3600;
    case DurationUnit.MINUTE:
    default:
      return durationAmount / 60;
  }
};
