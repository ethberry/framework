import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ParameterType } from "@framework/types";
import { NumberInput } from "@ethberry/mui-inputs-core";
import { DateTimeInput } from "@ethberry/mui-inputs-picker";

export interface IParameterMinValueInput {
  name?: string;
}

export const ParameterMinValueInput: FC<IParameterMinValueInput> = props => {
  const { name = "parameterMinValue" } = props;
  const form = useFormContext();
  const parameterType = useWatch({ name: `parameterType` });

  useEffect(() => {
    if (parameterType === ParameterType.NUMBER || parameterType === ParameterType.STRING) {
      form.setValue(name, 1);
    } else if (parameterType === ParameterType.DATE) {
      form.setValue(name, new Date().toISOString());
    } else {
      form.setValue(name, "");
    }
  }, [parameterType]);

  switch (parameterType) {
    case ParameterType.STRING:
    case ParameterType.NUMBER: {
      return <NumberInput name={name} inputProps={{ min: 0 }} />;
    }
    case ParameterType.DATE: {
      return <DateTimeInput name={name} />;
    }
    default: {
      return null;
    }
  }
};
