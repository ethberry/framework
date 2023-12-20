import { FC } from "react";
import { Sell } from "@mui/icons-material";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IToken } from "@framework/types";
import { ContractFeatures, TokenStatus } from "@framework/types";

interface ITokenSellButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const TokenSellButton: FC<ITokenSellButtonProps> = props => {
  const { className, disabled, token, variant = ListActionVariant.button } = props;

  const handleSell = (): void => {
    alert("Not implemented");
  };

  if (token.tokenStatus === TokenStatus.BURNED) {
    return null;
  }

  return (
    <ListAction
      icon={Sell}
      onClick={handleSell}
      message="form.buttons.sell"
      className={className}
      dataTestId="TokenSellButton"
      disabled={disabled || token.template?.contract?.contractFeatures.includes(ContractFeatures.SOULBOUND)}
      variant={variant}
    />
  );
};
