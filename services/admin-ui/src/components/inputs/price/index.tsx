import { FC } from "react";
import { Paper, Typography } from "@mui/material";

import { TokenTypeInput } from "./token-type-input";
import { UniContractInput } from "./uni-contract-input";
import { UniTokenInput } from "./uni-token-input";
import { AmountInput } from "./amount-input";

export interface IStakingEditDialogProps {
  prefix: string;
}

export const PriceInput: FC<IStakingEditDialogProps> = props => {
  const { prefix } = props;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography>Price</Typography>
      <TokenTypeInput prefix={prefix} />
      <UniContractInput prefix={prefix} />
      <UniTokenInput prefix={prefix} />
      <AmountInput prefix={prefix} />
    </Paper>
  );
};
