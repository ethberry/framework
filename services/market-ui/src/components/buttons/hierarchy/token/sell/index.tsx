import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";

import type { IToken } from "@framework/types";
import { ContractFeatures } from "@framework/types";

interface ITokenSellButtonProps {
  token: IToken;
}

export const TokenSellButton: FC<ITokenSellButtonProps> = props => {
  const { token } = props;

  const handleSell = (): void => {
    alert("Not implemented");
  };

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
