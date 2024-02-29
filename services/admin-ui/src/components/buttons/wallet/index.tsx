import { FC, useCallback, useMemo } from "react";
import { Badge, Box, Tooltip } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { useIntl } from "react-intl";

import { usePopup } from "@gemunion/provider-popup";
import { useUser } from "@gemunion/provider-user";
import { useWallet, WALLET_MENU_POPUP_TYPE } from "@gemunion/provider-wallet";
import { useAppDispatch, useAppSelector, walletActions } from "@gemunion/redux";

import { WalletIcon } from "./icon";
import { WalletMenuDialog } from "../../dialogs/wallet";
import { ConnectWallet } from "../../dialogs/connect";
import { StyledButton, StyledTooltipContent } from "./styled";

export const WalletButton: FC = () => {
  const { isOpenPopup, openPopup, closePopup } = usePopup();
  const { chainId, isActive, account } = useWeb3React();
  const { formatMessage } = useIntl();
  const { profile } = useUser<any>();
  const { closeConnectWalletDialog } = useWallet();
  const { isDialogOpen } = useAppSelector(state => state.wallet);
  const dispatch = useAppDispatch();
  const { setIsDialogOpen } = walletActions;

  const handleOpenDialog = useCallback(() => {
    isActive ? openPopup(WALLET_MENU_POPUP_TYPE) : dispatch(setIsDialogOpen(true));
  }, [isActive]);

  const handleCloseWalletDialog = () => {
    closePopup();
  };

  const isChainValid = !profile || !chainId || profile?.chainId === chainId;
  const isAccountMatch = !profile || !account || profile?.wallet === account.toLowerCase();

  const tooltipTitle = useMemo(() => {
    switch (true) {
      case !isAccountMatch:
        return (
          <StyledTooltipContent>{formatMessage({ id: "components.header.wallet.notMatch" })}</StyledTooltipContent>
        );
      case !isChainValid:
        return (
          <StyledTooltipContent>{formatMessage({ id: "components.header.wallet.notValid" })}</StyledTooltipContent>
        );
      case isChainValid:
        return (
          <StyledTooltipContent>
            {isActive ? account! : formatMessage({ id: "components.header.wallet.connect" })}
          </StyledTooltipContent>
        );
      default:
        return null;
    }
  }, [account, isActive, isChainValid, profile]);

  return (
    <Box>
      <Tooltip title={tooltipTitle} enterDelay={300}>
        <StyledButton color="inherit" onClick={handleOpenDialog} data-testid="OpenWalletOptionsDialog">
          <Badge color="error" badgeContent="!" invisible={isChainValid && isAccountMatch}>
            <WalletIcon />
            <Box sx={{ ml: 1 }}>
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)}`
                : formatMessage({ id: "components.header.wallet.connect" })}
            </Box>
          </Badge>
        </StyledButton>
      </Tooltip>
      <ConnectWallet onClose={closeConnectWalletDialog} open={isDialogOpen} />
      <WalletMenuDialog onClose={handleCloseWalletDialog} open={isOpenPopup(WALLET_MENU_POPUP_TYPE)} />
    </Box>
  );
};
