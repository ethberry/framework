import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "@ethberry/mui-inputs-core";
import { IAsset } from "@framework/types";

export interface IMaxInputProps {
  name?: string;
  readOnly?: boolean;
}

export const MaxInput: FC<IMaxInputProps> = props => {
  const { name = "max", readOnly } = props;

  const maxValue: number = useWatch({ name });
  const content: IAsset = useWatch({ name: "content" });

  const form = useFormContext<any>();

  useEffect(() => {
    if (maxValue > content.components.length) {
      form.setValue(name, content.components.length);
    }
    if (form.formState.errors[name] && maxValue <= content.components.length) {
      form.clearErrors(name);
    }
  }, [content.components.length]);

  return (
    <NumberInput
      required
      name={name}
      readOnly={readOnly}
      inputProps={{
        min: 2,
        max: content.components.length || 2,
      }}
    />
  );
};
