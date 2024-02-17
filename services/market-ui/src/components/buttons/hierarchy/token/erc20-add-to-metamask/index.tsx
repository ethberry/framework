import { FC } from "react";
import { Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { Button, SvgIcon } from "@mui/material";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import { MetaMaskIcon } from "@gemunion/provider-wallet";
import type { IToken } from "@framework/types";
import { TokenType } from "@framework/types";

interface IErc20AddToMetamaskButtonProps {
  token: IToken;
}

export const Erc20AddToMetamaskButton: FC<IErc20AddToMetamaskButtonProps> = props => {
  const { token } = props;

  const metaFnAdd = useMetamaskValue((web3Context: Web3ContextType) => {
    return web3Context.connector?.provider?.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: token.template!.contract!.address,
          symbol: token.template!.contract!.symbol,
          decimals: token.template!.contract!.decimals,
        },
      },
    }) as Promise<boolean>;
  });

  const handleAddToMetamask = async () => {
    await metaFnAdd();
  };

  return (
    <Button
      startIcon={<SvgIcon component={MetaMaskIcon} viewBox="0 0 60 60" />}
      onClick={handleAddToMetamask}
      disabled={token.template!.contract!.contractType !== TokenType.ERC20}
      data-testid="Erc20AddToMetamaskButton"
    >
      <FormattedMessage id="form.buttons.addToMetamask" />
    </Button>
  );
};
