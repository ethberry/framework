import { FC } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useSnackbar, OptionsObject } from "notistack";
import { Button, IconButton } from "@mui/material";
import { NoMetaMaskError, MetaMask } from "@web3-react/metamask";
import { useWeb3React } from "@web3-react/core";

import { MetaMaskIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { metaMask } from "../../connectors/meta-mask";
import { useWallet } from "../../provider";
import { TConnectors } from "../../connectors";

export interface IMetaMaskButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const MetaMaskButton: FC<IMetaMaskButtonProps> = props => {
  const { disabled, onClick } = props;

  const { isActive, connector } = useWeb3React();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { setActiveConnector, network } = useWallet();

  const notDetectedWeb3MessageConfig: OptionsObject = {
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
  };

  const handleClick = async () => {
    if (!(window as any).ethereum) {
      enqueueSnackbar(formatMessage({ id: "snackbar.web3-not-detected" }), notDetectedWeb3MessageConfig);
    }

    await metaMask
      .activate(network.chainId)
      .then(() => setActiveConnector(TConnectors.METAMASK))
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error("error", e);

        setActiveConnector(null);

        if (e && e.code === 4001) {
          enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
        } else if (e instanceof NoMetaMaskError) {
          enqueueSnackbar(formatMessage({ id: "snackbar.web3-not-detected" }), notDetectedWeb3MessageConfig);
        } else {
          enqueueSnackbar((e && e.message) || formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });

    onClick();
  };

  return (
    <CustomBadge invisible={!isActive || !(connector instanceof MetaMask)}>
      <IconButton disabled={disabled} onClick={handleClick}>
        <MetaMaskIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
