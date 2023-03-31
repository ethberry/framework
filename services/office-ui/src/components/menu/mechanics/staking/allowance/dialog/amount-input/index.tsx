import { FC } from "react";
import { Alert } from "@mui/material";
import { useWatch } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { EthInput } from "@gemunion/mui-inputs-mask";
import { TokenType } from "@framework/types";

export const AmountInput: FC = () => {
  const [contractType, decimals] = useWatch({ name: ["contract.contractType", "contract.decimals"] });

  if (contractType !== TokenType.ERC20) {
    return (
      <Alert severity="warning" sx={{ mt: 2 }}>
        <FormattedMessage id="form.hints.allowanceWarning" />
      </Alert>
    );
  }

  return <EthInput name="amount" units={decimals} symbol="" />;
};
