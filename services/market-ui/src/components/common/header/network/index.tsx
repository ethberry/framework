import { FC, MouseEvent, useState } from "react";
import {
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
  SvgIcon,
  Typography,
} from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";

import { availableChains } from "@framework/constants";
import { IUser } from "@framework/types";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { getIconByChainId, networks } from "@gemunion/provider-wallet";

export const NetworkButton: FC = () => {
  const user = useUser<IUser>();
  const { formatMessage } = useIntl();
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
  const isSandbox = networks[chainId]?.isSandbox;

  return (
    <ProgressOverlay isLoading={isLoading} spinnerSx={{ svg: { color: "#FFFFFF" } }}>
      <Tooltip title={formatMessage({ id: `enums.chainId.${chainId}` })} sx={{ mr: isSandbox ? 1 : 0 }}>
        <Badge
          color="primary"
          badgeContent={<Typography fontSize={10}>{formatMessage({ id: "components.badges.test" })}</Typography>}
          invisible={!isSandbox}
        >
          <IconButton
            aria-owns={anchor ? "select-chainId" : undefined}
            aria-haspopup="true"
            color="inherit"
            data-testid="OpenNetworkMenuButton"
            disabled={isLoading}
            onClick={handleMenuOpen}
          >
            <SvgIcon component={getIconByChainId(chainId) as any} viewBox="0 0 60 60" sx={{ width: 24, height: 24 }} />
          </IconButton>
        </Badge>
      </Tooltip>
      <Menu id="select-chainId" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        {availableChains.map(chainId => (
          <MenuItem key={chainId} onClick={handleSelectNetwork(chainId)} color="inherit">
            <ListItemIcon>
              <SvgIcon
                component={getIconByChainId(chainId) as any}
                viewBox="0 0 60 60"
                sx={{ width: 20, height: 20 }}
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
