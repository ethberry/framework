import { UseFormReturn } from "react-hook-form";

import { IVestingBox } from "@framework/types";

import { IOption } from "./select";
import { IPlotConfig } from "./types";

export const generateSteppedData = (config: IPlotConfig) => {
  const { duration, period, afterCliffBasisPoints } = config;
  const immediateRelease = afterCliffBasisPoints / 10000;
  const steps = Math.floor(duration / period);
  const stepIncrement = (1 - immediateRelease) / steps;

  const data: Array<Array<number>> = [];
  for (let i = 0; i <= steps; i++) {
    const x = i * period;
    const y = immediateRelease + i * stepIncrement;
    // Add horizontal line for the step
    data.push([x, y * 100]);
    if (i < steps) {
      const nextX = (i + 1) * period;
      data.push([nextX, y * 100]);
    }
  }

  return data;
};

export const optionsFilterByDuration = (
  value: number,
  duration: number,
  form: UseFormReturn<IVestingBox>,
  valueKey: keyof IVestingBox,
  options: Array<IOption<number>>,
) => {
  const filteredOptions = options.filter(option => option.value < duration);
  if (value > duration) {
    // @ts-ignore
    void form.setValue(valueKey, filteredOptions[0].value, { shouldDirty: true });
  }
  return filteredOptions;
};
