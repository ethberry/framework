import { FC, MouseEvent, useState } from "react";
import { Button, ListItemIcon, ListItemText, Menu, MenuItem, SvgIcon } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { availableChains } from "@framework/constants";
import { IUser } from "@framework/types";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { getIconByChainId } from "@gemunion/provider-wallet";

export const NetworkButton: FC = () => {
  const user = useUser<IUser>();
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

  return (
    <ProgressOverlay isLoading={isLoading} spinnerSx={{ svg: { color: "#FFFFFF" } }}>
      <Button
        aria-owns={anchor ? "select-chainId" : undefined}
        aria-haspopup="true"
        color="inherit"
        data-testid="OpenNetworkMenuButton"
        disabled={isLoading}
        endIcon={<ExpandMore />}
        onClick={handleMenuOpen}
        startIcon={
          <SvgIcon component={getIconByChainId(chainId) as any} viewBox="0 0 60 60" sx={{ width: 20, height: 20 }} />
        }
        variant="outlined"
      >
        <FormattedMessage id={`enums.chainId.${chainId}`} />
      </Button>
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
