import { FC } from "react";
import { useWatch } from "react-hook-form";

import { TokenType } from "@framework/types";
import { EthInput } from "@gemunion/mui-inputs-mask";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

export const AmountInput: FC = () => {
  const { decimals, contractType } = useWatch();

  if (contractType !== TokenType.ERC20) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.allowanceWarning" />
      </Alert>
    );
  }

  return <EthInput name="amount" units={decimals} symbol="" />;
};
