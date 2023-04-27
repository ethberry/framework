import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ParameterType } from "@framework/types";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

export interface IParameterMaxValueInput {
  name?: string;
}

export const ParameterMaxValueInput: FC<IParameterMaxValueInput> = props => {
  const { name = "parameterMaxValue" } = props;
  const form = useFormContext();
  const parameterType = useWatch({ name: `parameterType` });

  useEffect(() => {
    if (parameterType === ParameterType.NUMBER || parameterType === ParameterType.STRING) {
      form.setValue(name, 50);
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
