import { FC, useCallback, useMemo } from "react";
import { Badge, Box, IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";

import { usePopup } from "@gemunion/provider-popup";
import { useUser } from "@gemunion/provider-user";
import { useWallet, WALLET_CONNECT_POPUP_TYPE, WALLET_MENU_POPUP_TYPE } from "@gemunion/provider-wallet";

import { WalletIcon } from "./icon";
import { WalletMenuDialog } from "../../dialogs/wallet";
import { ConnectWallet } from "../../dialogs/connect";

export const WalletButton: FC = () => {
  const { isOpenPopup, openPopup, closePopup } = usePopup();
  const { chainId, isActive, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { profile } = useUser<any>();
  const { closeConnectWalletDialog } = useWallet();

  const handleOpenDialog = useCallback(() => {
    openPopup(isActive ? WALLET_MENU_POPUP_TYPE : WALLET_CONNECT_POPUP_TYPE);
  }, [isActive]);

  const handleCloseWalletDialog = () => {
    closePopup();
  };

  const isChainValid = !profile || !chainId || profile?.chainId === chainId;

  const tooltipTitle = useMemo(
    () => (
      <Box sx={{ textAlign: "center" }}>
        {isChainValid
          ? isActive
            ? account!
            : formatMessage({ id: "components.header.wallet.connect" })
          : formatMessage({ id: "components.header.wallet.notValid" })}
      </Box>
    ),
    [account, isActive, isChainValid, profile],
  );

  return (
    <Box mx={1}>
      <Tooltip title={tooltipTitle} enterDelay={300}>
        <IconButton color="inherit" onClick={handleOpenDialog} data-testid="OpenWalletOptionsDialog">
          <Badge color="error" badgeContent="!" invisible={isChainValid}>
            <WalletIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <ConnectWallet onClose={closeConnectWalletDialog} open={isOpenPopup(WALLET_CONNECT_POPUP_TYPE)} />
      <WalletMenuDialog onClose={handleCloseWalletDialog} open={isOpenPopup(WALLET_MENU_POPUP_TYPE)} />
    </Box>
  );
};
