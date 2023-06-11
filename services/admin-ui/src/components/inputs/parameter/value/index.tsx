import { FC } from "react";
import { useWatch } from "react-hook-form";

import { ParameterType } from "@framework/types";
import { TextInput } from "@gemunion/mui-inputs-core";

export interface IParameterValuesInput {
  name?: string;
}

export const ParameterValuesInput: FC<IParameterValuesInput> = props => {
  const { name = "parameterValue" } = props;

  const parameterType = useWatch({ name: "parameterType" });
  if (parameterType !== ParameterType.ENUM) {
    return null;
  }

  return <TextInput name={name} />;
};
