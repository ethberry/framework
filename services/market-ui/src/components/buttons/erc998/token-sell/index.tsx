import { FC } from "react";
import { Button } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { IUniToken } from "@framework/types";

interface IErc998TokenSellButtonProps {
  token: IUniToken;
}

export const Erc998TokenSellButton: FC<IErc998TokenSellButtonProps> = () => {
  const handleSell = (): void => {
    alert("Not implemented");
  };

  return (
    <Button onClick={handleSell} data-testid="Erc998TokenSellButton">
      <FormattedMessage id="form.buttons.sell" />
    </Button>
  );
};
