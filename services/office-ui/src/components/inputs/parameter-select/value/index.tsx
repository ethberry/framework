import { FC, useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { ParameterType } from "@framework/types";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

import { EnumSelectInput } from "./enum-select";
import { IParameterValueInput } from "./interface";

export const ParameterValueInput: FC<IParameterValueInput> = props => {
  const { name = "parameterValue", prefix } = props;

  const form = useFormContext();

  const parameterType = useWatch({ name: `${prefix}.parameterType` });
  const parameterValue = useWatch({ name: `${prefix}.${name}` });
  const parameterMinValue = useWatch({ name: `${prefix}.parameterMinValue` });
  const parameterMaxValue = useWatch({ name: `${prefix}.parameterMaxValue` });

  useEffect(() => {
    if (parameterType === ParameterType.NUMBER) {
      form.setValue(`${prefix}.${name}`, 0);
    }
    if (parameterType === ParameterType.STRING || parameterType === ParameterType.ENUM) {
      form.setValue(`${prefix}.${name}`, "");
    }
    if (parameterType === ParameterType.DATE) {
      form.setValue(`${prefix}.${name}`, new Date().toISOString());
    }
  }, [parameterType, prefix]);

  useEffect(() => {
    if (parameterType === ParameterType.NUMBER && parameterValue < parameterMinValue) {
      form.setValue(`${prefix}.${name}`, parameterMinValue);
    }
  }, [parameterMinValue, parameterType, prefix]);

  useEffect(() => {
    if (parameterType === ParameterType.NUMBER && parameterValue > parameterMaxValue) {
      form.setValue(`${prefix}.${name}`, parameterMaxValue);
    }
  }, [parameterMaxValue, parameterType, prefix]);

  return useMemo(() => {
    switch (parameterType) {
      case ParameterType.NUMBER: {
        return (
          <NumberInput name={`${prefix}.${name}`} inputProps={{ min: parameterMinValue, max: parameterMaxValue }} />
        );
      }
      case ParameterType.STRING: {
        return <TextInput name={`${prefix}.${name}`} />;
      }
      case ParameterType.DATE: {
        return <DateTimeInput name={`${prefix}.${name}`} />;
      }
      case ParameterType.ENUM: {
        return <EnumSelectInput name={name} options={[]} prefix={prefix} />;
      }
      default: {
        return null;
      }
    }
  }, [name, parameterType, parameterMaxValue, prefix]);
};
