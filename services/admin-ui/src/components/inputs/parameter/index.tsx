import { FC } from "react";
import { Box } from "@mui/material";

import type { IParameter } from "@framework/types";

import { ParameterMinValueInput } from "./minValue";
import { ParameterMaxValueInput } from "./maxValue";
import { ParameterTypeInput } from "./type";
import { ParameterValuesInput } from "./value";
import { ParameterNameInput } from "./name";

export interface IParameterSelectInput {
  parameters: IParameter[];
}

export const ParameterInput: FC<IParameterSelectInput> = props => {
  const { parameters: _ } = props;
  return (
    <Box>
      <ParameterNameInput />
      <ParameterTypeInput />
      <ParameterValuesInput />
      <ParameterMinValueInput />
      <ParameterMaxValueInput />
    </Box>
  );
};
