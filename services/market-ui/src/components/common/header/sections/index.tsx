import { FC, Fragment, MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";
import { matchPath, useLocation } from "react-router";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { NavLink as RouterNavLink } from "react-router-dom";

import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";

export const Sections: FC = () => {
  const location = useLocation();

  const [anchor, setAnchor] = useState<Element | null>(null);

  const user = useUser<IUser>();

  const handleMenuOpen = (event: MouseEvent): void => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchor(null);
  };

  const logout = async (e: MouseEvent): Promise<void> => {
    e.preventDefault();
    handleMenuClose();
    await user.logOut("/login");
  };

  if (!user.isAuthenticated()) {
    return null;
  }

  return (
    <Fragment>
      <IconButton
        aria-owns={anchor ? "material-appbar" : undefined}
        aria-haspopup="true"
        data-testid="OpenSiteMenuButton"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <Avatar alt={user.profile.displayName} src={user.profile.imageUrl}>
          {user.profile.displayName?.substr(0, 1)}
        </Avatar>
      </IconButton>
      <Menu id="material-appbar" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        <MenuItem
          onClick={handleMenuClose}
          color="inherit"
          component={RouterNavLink}
          to="/profile"
          selected={!!matchPath(location.pathname, "/profile")}
        >
          <FormattedMessage id="components.header.menu.profile" />
        </MenuItem>
        <MenuItem to="/logout" onClick={logout} component={RouterNavLink}>
          <FormattedMessage id="components.header.menu.logout" />
        </MenuItem>
      </Menu>
    </Fragment>
  );
};
