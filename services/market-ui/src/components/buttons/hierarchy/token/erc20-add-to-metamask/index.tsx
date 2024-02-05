import { FC, Fragment } from "react";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";
import { IconButton, SvgIcon, Tooltip } from "@mui/material";

import { useMetamaskValue } from "@gemunion/react-hooks-eth";
import { TConnectors, useAppSelector } from "@gemunion/redux";
import { MetaMaskIcon } from "@gemunion/provider-wallet";
import type { IToken } from "@framework/types";
import { TokenType } from "@framework/types";

interface IErc20AddToMetamaskButtonProps {
  token: IToken;
}

export const Erc20AddToMetamaskButton: FC<IErc20AddToMetamaskButtonProps> = props => {
  const { token } = props;

  const { formatMessage } = useIntl();

  const { activeConnector } = useAppSelector(state => state.wallet);
  const { connector, isActive } = useWeb3React();

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

  if (!isActive || !connector || activeConnector !== TConnectors.METAMASK) {
    return null;
  }

  return (
    <Fragment>
      <Tooltip title={formatMessage({ id: "form.buttons.addToMetamask" })}>
        <IconButton
          onClick={handleAddToMetamask}
          disabled={token.template!.contract!.contractType !== TokenType.ERC20}
          data-testid="Erc20AddToMetamaskButton"
        >
          <SvgIcon component={MetaMaskIcon} viewBox="0 0 60 60" />
        </IconButton>
      </Tooltip>
    </Fragment>
  );
};
