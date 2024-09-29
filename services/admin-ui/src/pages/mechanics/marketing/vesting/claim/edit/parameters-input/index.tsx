import { FC } from "react";
import { Paper } from "@mui/material";
import { NumberInput, TextInput } from "@ethberry/mui-inputs-core";
import { DateInput } from "@ethberry/mui-inputs-picker";
import { CurrencyInput } from "@ethberry/mui-inputs-mask";

export interface IVestingParametersInputProps {
  prefix: string;
}

export const VestingParametersInput: FC<IVestingParametersInputProps> = props => {
  const { prefix = "parameters" } = props;

  return (
    <Paper sx={{ p: 2, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
      <TextInput name={`${prefix}.owner`} />
      <DateInput name={`${prefix}.startTimestamp`} />
      <NumberInput name={`${prefix}.cliffInMonth`} />
      <CurrencyInput name={`${prefix}.monthlyRelease`} symbol="%" />
    </Paper>
  );
};
