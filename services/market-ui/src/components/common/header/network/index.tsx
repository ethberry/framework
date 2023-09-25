import { FC, MouseEvent, useState } from "react";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { Help } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { getIconByChainId, SANDBOX_CHAINS } from "@gemunion/provider-wallet";
import { availableChains } from "@framework/constants";
import type { IUser } from "@framework/types";

import { spinnerMixin, StyledBadge, StyledCircle, StyledSvgIcon } from "./styled";

export const NetworkButton: FC = () => {
  const user = useUser<IUser>();
  const { formatMessage } = useIntl();
  const { chainId: web3ChainId } = useWeb3React();
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMenuOpen = (event: MouseEvent): void => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchor(null);
  };

  const handleSelectNetwork = (chainId: number) => async () => {
    setIsLoading(true);
    handleMenuClose();
    await user.setProfile({ chainId });
    setIsLoading(false);
  };

  if (!user?.profile) {
    return null;
  }

  const { chainId } = user.profile;
  const isSandbox = SANDBOX_CHAINS.includes(chainId);

  return (
    <ProgressOverlay isLoading={isLoading} spinnerSx={spinnerMixin}>
      <Tooltip
        title={`${formatMessage({ id: `enums.chainId.${chainId}` })}${
          isSandbox ? ` (${formatMessage({ id: "components.header.wallet.test" })})` : ""
        }`}
      >
        <StyledBadge color="primary" badgeContent={<StyledCircle />} invisible={!isSandbox}>
          <IconButton
            aria-owns={anchor ? "select-chainId" : undefined}
            aria-haspopup="true"
            color="inherit"
            data-testid="OpenNetworkMenuButton"
            onClick={handleMenuOpen}
          >
            <StyledSvgIcon component={(getIconByChainId(chainId) as any) || <Help />} viewBox="0 0 60 60" />
          </IconButton>
        </StyledBadge>
      </Tooltip>
      <Menu id="select-chainId" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        {availableChains.map(chainId => (
          <MenuItem
            key={chainId}
            selected={chainId === web3ChainId}
            onClick={handleSelectNetwork(chainId)}
            color="inherit"
          >
            <ListItemIcon>
              <StyledSvgIcon component={getIconByChainId(chainId) as any} viewBox="0 0 60 60" />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id={`enums.chainId.${chainId}`} />
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </ProgressOverlay>
  );
};
