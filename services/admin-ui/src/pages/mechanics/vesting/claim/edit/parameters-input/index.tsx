import { FC } from "react";
import { Paper } from "@mui/material";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";

export interface IVestingParametersInputProps {
  prefix: string;
}

export const VestingParametersInput: FC<IVestingParametersInputProps> = props => {
  const { prefix = "parameters" } = props;

  return (
    <Paper sx={{ p: 2, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
      <TextInput name={`${prefix}.beneficiary`} />
      <DateInput name={`${prefix}.startTimestamp`} />
      <NumberInput name={`${prefix}.cliffInMonth`} />
      <CurrencyInput name={`${prefix}.monthlyRelease`} symbol="%" />
    </Paper>
  );
};
