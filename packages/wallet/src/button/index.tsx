import { FC } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";

import { usePopup } from "@gemunion/provider-popup";
import { useLicense } from "@gemunion/provider-license";

import { WalletIcon } from "../icon";
import { WalletMenuDialog } from "../menu-dialog";
import { useWallet, WALLET_CONNECT_POPUP_TYPE, WALLET_MENU_POPUP_TYPE } from "../provider";
import { WalletDialog } from "../dialog";

export const Wallet: FC = () => {
  const { isOpenPopup, openPopup, closePopup } = usePopup();
  const { isActive, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const license = useLicense();
  const { closeConnectWalletDialog } = useWallet();

  const handleOpenWalletDialog = () => {
    openPopup(WALLET_MENU_POPUP_TYPE);
  };

  const handleCloseWalletDialog = () => {
    closePopup();
  };

  const handleOpenConnectDialog = () => {
    openPopup(WALLET_CONNECT_POPUP_TYPE);
  };

  if (!license.isValid()) {
    return null;
  }

  return (
    <Box mx={1}>
      {isActive ? (
        <Tooltip title={account!} enterDelay={300}>
          <IconButton color="inherit" onClick={handleOpenWalletDialog} data-testid="OpenWalletOptionsDialog">
            <WalletIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title={formatMessage({ id: "components.header.wallet.connect" })} enterDelay={300}>
          <IconButton color="inherit" onClick={handleOpenConnectDialog} data-testid="OpenWalletConnectDialog">
            <WalletIcon />
          </IconButton>
        </Tooltip>
      )}
      <WalletDialog onClose={closeConnectWalletDialog} open={isOpenPopup(WALLET_CONNECT_POPUP_TYPE)} />
      <WalletMenuDialog onClose={handleCloseWalletDialog} open={isOpenPopup(WALLET_MENU_POPUP_TYPE)} />
    </Box>
  );
};
