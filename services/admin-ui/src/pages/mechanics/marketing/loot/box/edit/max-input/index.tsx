import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "@gemunion/mui-inputs-core";
import { IAsset } from "@framework/types";

export interface IMaxInputProps {
  name?: string;
}

export const MaxInput: FC<IMaxInputProps> = props => {
  const { name = "max" } = props;

  const maxValue: number = useWatch({ name });
  const item: IAsset = useWatch({ name: "item" });

  const form = useFormContext<any>();

  useEffect(() => {
    if (maxValue > item.components.length) {
      form.setValue(name, item.components.length);
    }
  }, [item.components.length]);

  return (
    <NumberInput
      name={name}
      inputProps={{
        min: 1,
        max: item.components.length,
      }}
    />
  );
};
