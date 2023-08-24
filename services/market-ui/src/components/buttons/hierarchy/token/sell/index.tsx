import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";

import type { IToken } from "@framework/types";
import { ContractFeatures, TokenStatus } from "@framework/types";

interface ITokenSellButtonProps {
  token: IToken;
}

export const TokenSellButton: FC<ITokenSellButtonProps> = props => {
  const { token } = props;

  const handleSell = (): void => {
    alert("Not implemented");
  };

  if (token.tokenStatus === TokenStatus.BURNED) {
    return null;
  }

  return (
    <Button
      onClick={handleSell}
      disabled={token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
      data-testid="TokenSellButton"
    >
      <FormattedMessage id="form.buttons.sell" />
    </Button>
  );
};
