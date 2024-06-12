import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "@gemunion/mui-inputs-core";

export interface IMinInputProps {
  name?: string;
}

export const MinInput: FC<IMinInputProps> = props => {
  const { name = "min" } = props;

  const minValue: number = useWatch({ name });
  const maxValue: number = useWatch({ name: "max" });

  const form = useFormContext<any>();

  useEffect(() => {
    // maxValue can be ""
    if (typeof maxValue !== "string" && minValue >= maxValue) {
      form.setValue(name, maxValue - 1);
    }
  }, [maxValue]);

  return (
    <NumberInput
      name={name}
      inputProps={{
        min: 1,
        max: maxValue - 1,
      }}
    />
  );
};
