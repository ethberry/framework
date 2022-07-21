import { FC } from "react";
import { IconButton } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { WalletConnectIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { useWallet } from "../../provider";
import { walletConnect } from "../../connectors/wallet-connect";
import { TConnectors } from "../../connectors";

export interface IWalletConnectButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/walletconnect.md
export const WalletConnectButton: FC<IWalletConnectButtonProps> = props => {
  const { disabled, onClick } = props;

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { isActive, connector } = useWeb3React();
  const { setActiveConnector, network } = useWallet();

  const handleClick = async () => {
    await walletConnect
      .activate(network.chainId)
      .then(() => setActiveConnector(TConnectors.WALLETCONNECT))
      .catch(e => {
        // eslint-disable-next-line no-console
        console.error("error", e);

        setActiveConnector(null);

        if (e && e.code === 4001) {
          enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
        } else {
          enqueueSnackbar((e && e.message) || formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
    onClick();
  };

  return (
    <CustomBadge invisible={!isActive || !(connector instanceof WalletConnect)}>
      <IconButton disabled={disabled} onClick={handleClick}>
        <WalletConnectIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
