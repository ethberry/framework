import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ParameterType } from "@framework/types";
import { NumberInput } from "@gemunion/mui-inputs-core";

import { IParameterMinValueInput } from "./interface";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

export const ParameterMinValueInput: FC<IParameterMinValueInput> = props => {
  const { name = "parameterMinValue", prefix } = props;
  const form = useFormContext();
  const parameterType = useWatch({ name: `${prefix}.parameterType` });

  useEffect(() => {
    if (parameterType === ParameterType.NUMBER || parameterType === ParameterType.STRING) {
      form.setValue(`${prefix}.${name}`, 1);
    } else if (parameterType === ParameterType.DATE) {
      form.setValue(`${prefix}.${name}`, new Date().toISOString());
    } else {
      form.setValue(`${prefix}.${name}`, null);
    }
  }, [parameterType, prefix]);

  switch (parameterType) {
    case ParameterType.STRING:
    case ParameterType.NUMBER: {
      return <NumberInput name={`${prefix}.${name}`} inputProps={{ min: 0 }} />;
    }
    case ParameterType.DATE: {
      return <DateTimeInput name={`${prefix}.${name}`} />;
    }
    default: {
      return null;
    }
  }
};
