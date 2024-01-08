import { FC, useCallback, useMemo } from "react";
import { Badge, Box, IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";

import { usePopup } from "@gemunion/provider-popup";
import { useLicense } from "@gemunion/provider-license";
import { useUser } from "@gemunion/provider-user";

import { WalletIcon } from "../icon";
import { WalletMenuDialog } from "../menu-dialog";
import { useWallet, WALLET_CONNECT_POPUP_TYPE, WALLET_MENU_POPUP_TYPE } from "../provider";
import { WalletDialog } from "../dialog";

export const Wallet: FC = () => {
  const { isOpenPopup, openPopup, closePopup } = usePopup();
  const { chainId, isActive, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const license = useLicense();
  const { profile } = useUser<any>();
  const { closeConnectWalletDialog } = useWallet();

  const handleOpenDialog = useCallback(() => {
    openPopup(isActive ? WALLET_MENU_POPUP_TYPE : WALLET_CONNECT_POPUP_TYPE);
  }, [isActive]);

  const handleCloseWalletDialog = () => {
    closePopup();
  };

  if (!license.isValid()) {
    return null;
  }

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
    <Box>
      <Tooltip title={tooltipTitle} enterDelay={300}>
        <IconButton color="inherit" onClick={handleOpenDialog} data-testid="OpenWalletOptionsDialog">
          <Badge color="error" badgeContent="!" invisible={isChainValid}>
            <WalletIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <WalletDialog onClose={closeConnectWalletDialog} open={isOpenPopup(WALLET_CONNECT_POPUP_TYPE)} />
      <WalletMenuDialog onClose={handleCloseWalletDialog} open={isOpenPopup(WALLET_MENU_POPUP_TYPE)} />
    </Box>
  );
};
