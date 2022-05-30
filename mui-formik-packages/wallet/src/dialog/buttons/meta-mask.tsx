import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar } from "notistack";
import { Button, IconButton } from "@mui/material";
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError } from "@web3-react/injected-connector";
import { useWeb3React } from "@web3-react/core";

import { MetaMaskIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { injectedConnector } from "../../connectors/meta-mask";
import { useWallet } from "../../provider";

export interface IMetaMaskButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/injected.md
export const MetaMaskButton: FC<IMetaMaskButtonProps> = props => {
  const { disabled, onClick } = props;

  const { activate, active, error, connector } = useWeb3React();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { setActiveConnector } = useWallet();

  if (error instanceof UserRejectedRequestError) {
    enqueueSnackbar(error.message, { variant: "warning" });
    setActiveConnector(null);
  }

  const handleClick = async () => {
    if (error instanceof NoEthereumProviderError || !(window as any).ethereum) {
      enqueueSnackbar(formatMessage({ id: "snackbar.web3-not-detected" }), {
        variant: "warning",
        action: () => (
          <Button
            onClick={() => {
              window.open("https://metamask.io/download.html", "_blank");
            }}
          >
            <FormattedMessage id="buttons.download-metamask" />
          </Button>
        ),
      });
    }

    await activate(injectedConnector, console.error);
    onClick();
  };

  return (
    <CustomBadge invisible={!active || !(connector instanceof InjectedConnector)}>
      <IconButton disabled={disabled} onClick={handleClick}>
        <MetaMaskIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
