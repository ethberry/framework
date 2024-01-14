import { FC, useCallback, useMemo } from "react";
import { Badge, Box, IconButton, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";

import { usePopup } from "@gemunion/provider-popup";
import { useLicense } from "@gemunion/provider-license";
import { useUser } from "@gemunion/provider-user";
import { useAppDispatch, useAppSelector, walletActions } from "@gemunion/redux";

import { WalletIcon } from "../icon";
import { WalletMenuDialog } from "../menu-dialog";
import { useWallet, WALLET_MENU_POPUP_TYPE } from "../provider";
import { WalletDialog } from "../dialog";

export const Wallet: FC = () => {
  const { isOpenPopup, openPopup, closePopup } = usePopup();
  const { chainId, isActive, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const license = useLicense();
  const { profile } = useUser<any>();
  const { isDialogOpen } = useAppSelector(state => state.wallet);
  const dispatch = useAppDispatch();
  const { setIsDialogOpen } = walletActions;
  const { closeConnectWalletDialog } = useWallet();

  const handleOpenDialog = useCallback(() => {
    isActive ? openPopup(WALLET_MENU_POPUP_TYPE) : dispatch(setIsDialogOpen(true));
  }, [isActive]);

  const handleCloseWalletDialog = () => {
    closePopup();
  };

  if (!license.isValid()) {
    return null;
  }

  const isChainValid = !profile || !chainId || profile?.chainId === chainId;
  const isAccountMatch = !profile || !account || profile?.wallet === account;

  const tooltipTitle = useMemo(() => {
    switch (true) {
      case !isAccountMatch:
        return <Box sx={{ textAlign: "center" }}>{formatMessage({ id: "components.header.wallet.notMatch" })}</Box>;
      case !isChainValid:
        return <Box sx={{ textAlign: "center" }}>{formatMessage({ id: "components.header.wallet.notValid" })}</Box>;
      case isChainValid:
        return (
          <Box sx={{ textAlign: "center" }}>
            {isActive ? account! : formatMessage({ id: "components.header.wallet.connect" })}
          </Box>
        );
      default:
        return null;
    }
  }, [account, isActive, isChainValid, profile]);

  return (
    <Box>
      <Tooltip title={tooltipTitle} enterDelay={300}>
        <IconButton color="inherit" onClick={handleOpenDialog} data-testid="OpenWalletOptionsDialog">
          <Badge color="error" badgeContent="!" invisible={isChainValid && isAccountMatch}>
            <WalletIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <WalletDialog onClose={closeConnectWalletDialog} open={isDialogOpen} />
      <WalletMenuDialog onClose={handleCloseWalletDialog} open={isOpenPopup(WALLET_MENU_POPUP_TYPE)} />
    </Box>
  );
};
