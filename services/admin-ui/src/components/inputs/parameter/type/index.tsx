import { FC } from "react";

import { ParameterType } from "@framework/types";
import { SelectInput } from "@gemunion/mui-inputs-core";

import { IParameterTypeInput } from "./interface";

export const ParameterTypeInput: FC<IParameterTypeInput> = props => {
  const { name = "parameterType", options = ParameterType, prefix } = props;

  return <SelectInput name={`${prefix}.${name}`} options={options} />;
};
