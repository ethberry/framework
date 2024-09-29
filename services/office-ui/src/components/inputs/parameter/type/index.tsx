import { FC } from "react";

import { ParameterType } from "@framework/types";
import { SelectInput } from "@ethberry/mui-inputs-core";

export interface IParameterTypeInput {
  name?: string;
}

export const ParameterTypeInput: FC<IParameterTypeInput> = props => {
  const { name = "parameterType" } = props;

  return <SelectInput name={name} options={ParameterType} />;
};
