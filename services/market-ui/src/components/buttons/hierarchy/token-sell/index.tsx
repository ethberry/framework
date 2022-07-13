import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { IToken } from "@framework/types";

interface ITokenSellButtonProps {
  token: IToken;
}

export const TokenSellButton: FC<ITokenSellButtonProps> = () => {
  const handleSell = (): void => {
    alert("Not implemented");
  };

  return (
    <Button onClick={handleSell} data-testid="TokenSellButton">
      <FormattedMessage id="form.buttons.sell" />
    </Button>
  );
};
