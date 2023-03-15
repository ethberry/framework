import { FC, useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { TextInput, NumberInput } from "@gemunion/mui-inputs-core";
import { DateTimeInput } from "@gemunion/mui-inputs-picker";

import { PARAMETER_TYPE } from "../type/interface";
import { IParameterValueInput } from "./interface";

export const ParameterValueInput: FC<IParameterValueInput> = props => {
  const { name = "parameterValue", prefix } = props;

  const form = useFormContext();
  const parameterType = useWatch({ name: `${prefix}.parameterType` });
  const parameterValue = useWatch({ name: `${prefix}.${name}` });
  const parameterMaxValue = useWatch({ name: `${prefix}.parameterMaxValue` });

  useEffect(() => {
    if (parameterType === PARAMETER_TYPE.number) {
      form.setValue(`${prefix}.${name}`, 0);
    }
    if (parameterType === PARAMETER_TYPE.string) {
      form.setValue(`${prefix}.${name}`, "");
    }
    if (parameterType === PARAMETER_TYPE.date) {
      form.setValue(`${prefix}.${name}`, new Date().toISOString());
    }
  }, [parameterType, prefix]);

  useEffect(() => {
    if (parameterType === PARAMETER_TYPE.number && parameterValue > parameterMaxValue) {
      form.setValue(`${prefix}.${name}`, parameterMaxValue);
    }
  }, [parameterMaxValue, parameterType, prefix]);

  return useMemo(() => {
    switch (parameterType) {
      case PARAMETER_TYPE.number: {
        return <NumberInput name={`${prefix}.${name}`} inputProps={{ min: 0, max: parameterMaxValue }} />;
      }
      case PARAMETER_TYPE.string: {
        return <TextInput name={`${prefix}.${name}`} />;
      }
      case PARAMETER_TYPE.date: {
        return <DateTimeInput name={`${prefix}.${name}`} />;
      }
      default: {
        return null;
      }
    }
  }, [name, parameterType, parameterMaxValue, prefix]);
};
