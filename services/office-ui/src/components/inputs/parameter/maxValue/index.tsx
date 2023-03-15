import { FC, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { NumberInput } from "@gemunion/mui-inputs-core";

import { PARAMETER_TYPE } from "../type/interface";
import { IParameterMaxValueInput } from "./interface";

export const ParameterMaxValueInput: FC<IParameterMaxValueInput> = props => {
  const { name = "parameterMaxValue", prefix } = props;
  const form = useFormContext();
  const parameterType = useWatch({ name: `${prefix}.parameterType` });

  useEffect(() => {
    if (parameterType === PARAMETER_TYPE.number) {
      form.setValue(`${prefix}.${name}`, 3);
    } else {
      form.setValue(`${prefix}.${name}`, undefined);
    }
  }, [parameterType, prefix]);

  switch (parameterType) {
    case PARAMETER_TYPE.number: {
      return <NumberInput name={`${prefix}.${name}`} inputProps={{ min: 0 }} />;
    }
    case PARAMETER_TYPE.string:
    case PARAMETER_TYPE.date:
    default: {
      return null;
    }
  }
};
