import { FC } from "react";
import { IconButton } from "@mui/material";
import { UserRejectedRequestError, WalletConnectConnector } from "@web3-react/walletconnect-connector";
import { useWeb3React } from "@web3-react/core";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { WalletConnectIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { useWallet } from "../../provider";
import { Connectors } from "../../connectors";

export interface IWalletConnectButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/walletconnect.md
export const WalletConnectButton: FC<IWalletConnectButtonProps> = props => {
  const { disabled, onClick } = props;

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();
  const { activate, active, error, connector } = useWeb3React();
  const { setActiveConnector } = useWallet();

  if (error instanceof UserRejectedRequestError) {
    setActiveConnector(null);
    enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
  }

  const handleClick = async () => {
    await activate(Connectors.WALLETCONNECT, error => {
      if (error instanceof UserRejectedRequestError) {
        setActiveConnector(null);
        enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
      } else {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    });
    onClick();
  };

  return (
    <CustomBadge invisible={!active || !(connector instanceof WalletConnectConnector)}>
      <IconButton disabled={disabled} onClick={handleClick}>
        <WalletConnectIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
