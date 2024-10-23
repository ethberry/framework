import { FC, useEffect } from "react";
import { useFormContext, useWatch, UseFormTrigger } from "react-hook-form";

import { NumberInput } from "@ethberry/mui-inputs-core";

export interface IMinInputProps {
  name?: string;
  readOnly?: boolean;
}

const changeMinByMaxAndTriggerMin = (
  maxValue: number,
  trigger?: UseFormTrigger<{ min: number; [key: string]: any }>,
) => {
  /** set min value 1 if max value less than 3 **/
  if (maxValue < 3) {
    if (trigger) {
      void trigger("min");
    }
    return 1;
  }
  return maxValue - 1;
};

export const MinInput: FC<IMinInputProps> = props => {
  const { name = "min", readOnly } = props;

  const minValue: number = useWatch({ name });
  const maxValue: number = useWatch({ name: "max" });

  const form = useFormContext<any>();

  useEffect(() => {
    // maxValue can be ""
    if (typeof maxValue !== "string" && minValue >= maxValue) {
      form.setValue(name, changeMinByMaxAndTriggerMin(maxValue, form.trigger));
    }
  }, [maxValue]);

  return (
    <NumberInput
      required
      name={name}
      readOnly={readOnly}
      inputProps={{
        min: 1,
        max: changeMinByMaxAndTriggerMin(maxValue),
      }}
    />
  );
};
