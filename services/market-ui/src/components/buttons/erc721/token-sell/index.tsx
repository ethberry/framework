import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { IUniToken } from "@framework/types";

interface IErc721TokenSellButtonProps {
  token: IUniToken;
}

export const Erc721TokenSellButton: FC<IErc721TokenSellButtonProps> = () => {
  const handleSell = (): void => {
    alert("Not implemented");
  };

  return (
    <Button onClick={handleSell} data-testid="Erc721TokenSellButton">
      <FormattedMessage id="form.buttons.sell" />
    </Button>
  );
};
