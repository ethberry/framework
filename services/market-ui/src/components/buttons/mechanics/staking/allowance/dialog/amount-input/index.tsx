import { FC } from "react";
import { useWatch } from "react-hook-form";
import { FormattedMessage } from "react-intl";

import { EthInput } from "@gemunion/mui-inputs-mask";
import { TokenType } from "@framework/types";

import { StyledAlert } from "./styled";

export const AmountInput: FC = () => {
  const {
    contract: { contractType, decimals },
  } = useWatch();

  if (contractType !== TokenType.ERC20) {
    return (
      <StyledAlert severity="warning">
        <FormattedMessage id="alert.allowanceWarning" />
      </StyledAlert>
    );
  }

  return <EthInput name="amount" units={decimals} symbol="" />;
};
