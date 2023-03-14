import { FC } from "react";

import { SelectInput } from "@gemunion/mui-inputs-core";

import { IParameterTypeInput, PARAMETER_TYPE } from "./interface";

export const ParameterTypeInput: FC<IParameterTypeInput> = props => {
  const { name = "parameterType", options = PARAMETER_TYPE, prefix } = props;

  return <SelectInput name={`${prefix}.${name}`} options={options} />;
};
