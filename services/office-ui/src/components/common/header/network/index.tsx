import { FC, MouseEvent, useState } from "react";
import { IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Tooltip } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { SANDBOX_CHAINS } from "@gemunion/provider-wallet";
import type { IUser } from "@framework/types";
import { useAppSelector } from "@gemunion/redux";

import { spinnerMixin, StyledBadge, StyledCircle, StyledListItemIcon, StyledSvgIcon } from "./styled";
import { getChainIconParams } from "./utils";

export const NetworkButton: FC = () => {
  const user = useUser<IUser>();
  const { formatMessage } = useIntl();
  const [anchor, setAnchor] = useState<Element | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { networks } = useAppSelector(state => state.wallet);

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

  if (!user?.profile || !Object.keys(networks).length) {
    return null;
  }

  const { chainId } = user.profile;
  const isSandbox = SANDBOX_CHAINS.includes(chainId);
  const { chainIcon, viewBox } = getChainIconParams(chainId);

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
            <StyledSvgIcon component={chainIcon} viewBox={viewBox} />
          </IconButton>
        </StyledBadge>
      </Tooltip>
      <Menu id="select-chainId" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        {Object.values(networks)
          .sort((a, b) => Number(a.order) - Number(b.order))
          .map(network => {
            const { chainIcon, viewBox } = getChainIconParams(network.chainId);
            return (
              <MenuItem
                key={network.chainId}
                selected={network.chainId === chainId}
                onClick={handleSelectNetwork(network.chainId)}
                color="inherit"
              >
                <StyledListItemIcon>
                  <StyledSvgIcon component={chainIcon} viewBox={viewBox} />
                </StyledListItemIcon>
                <ListItemText>
                  <FormattedMessage id={`enums.chainId.${network.chainId}`} />
                </ListItemText>
              </MenuItem>
            );
          })}
      </Menu>
    </ProgressOverlay>
  );
};
