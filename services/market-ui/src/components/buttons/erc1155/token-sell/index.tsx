import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { IUniToken } from "@framework/types";

interface IErc1155TokenSellButtonProps {
  token: IUniToken;
}

export const Erc1155TokenSellButton: FC<IErc1155TokenSellButtonProps> = () => {
  const handleSell = (): void => {
    alert("Not implemented");
  };

  return (
    <Button onClick={handleSell} data-testid="Erc1155TokenSellButton">
      <FormattedMessage id="form.buttons.sell" />
    </Button>
  );
};
