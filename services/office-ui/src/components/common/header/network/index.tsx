import { FC, MouseEvent, useState } from "react";
import { Badge, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, SvgIcon, Tooltip } from "@mui/material";
import { Circle } from "@mui/icons-material";
import { FormattedMessage, useIntl } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { availableChains } from "@framework/constants";
import type { IUser } from "@framework/types";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { getIconByChainId, SANDBOX_CHAINS } from "@gemunion/provider-wallet";

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
    <ProgressOverlay isLoading={isLoading} spinnerSx={{ svg: { color: "#FFFFFF" } }}>
      <Tooltip
        title={`${formatMessage({ id: `enums.chainId.${chainId}` })}${
          isSandbox ? ` (${formatMessage({ id: "components.header.wallet.test" })})` : ""
        }`}
      >
        <Badge
          color="primary"
          badgeContent={<Circle sx={{ color: "#F44336", width: 12, height: 12 }} />}
          sx={{ ".MuiBadge-badge": { minWidth: 12, height: 12, p: 0, mr: 0.7, mt: 0.7 } }}
          invisible={!isSandbox}
        >
          <IconButton
            aria-owns={anchor ? "select-chainId" : undefined}
            aria-haspopup="true"
            color="inherit"
            data-testid="OpenNetworkMenuButton"
            onClick={handleMenuOpen}
          >
            <SvgIcon component={getIconByChainId(chainId) as any} viewBox="0 0 60 60" sx={{ width: 24, height: 24 }} />
          </IconButton>
        </Badge>
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
              <SvgIcon
                component={getIconByChainId(chainId) as any}
                viewBox="0 0 60 60"
                sx={{ width: 24, height: 24 }}
              />
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
