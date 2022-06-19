import { FC, Fragment, MouseEvent, useState } from "react";
import { FormattedMessage } from "react-intl";
import { matchPath, useLocation, useNavigate } from "react-router";
import { Avatar, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink, NavLink as RouterNavLink } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";

import { useUser } from "@gemunion/provider-user";
import { useApi } from "@gemunion/provider-api-firebase";
import { IUser } from "@framework/types";

import { useStyles } from "./styles";

export const Sections: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const classes = useStyles();
  const [anchor, setAnchor] = useState<Element | null>(null);

  const user = useUser<IUser>();
  const api = useApi();

  const handleMenuOpen = (event: MouseEvent): void => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchor(null);
  };

  const logout = async (e: MouseEvent): Promise<void> => {
    e.preventDefault();
    handleMenuClose();
    const auth = getAuth();
    await signOut(auth);
    api.setToken(null);
    navigate("/login");
  };

  if (!user.isAuthenticated()) {
    if (matchPath(location.pathname, "/login")) {
      return null;
    }

    return (
      <Button className={classes.login} variant="outlined" size="large" component={RouterLink} to="/login">
        <FormattedMessage id="components.header.menu.login" />
      </Button>
    );
  }

  return (
    <Fragment>
      <IconButton
        aria-owns={anchor ? "material-appbar" : undefined}
        aria-haspopup="true"
        onClick={handleMenuOpen}
        color="inherit"
      >
        <Avatar alt={user.profile.displayName} src={user.profile.imageUrl}>
          {user.profile.displayName.substr(0, 1)}
        </Avatar>
      </IconButton>
      <Menu id="material-appbar" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        <MenuItem
          component={RouterNavLink}
          to="/dashboard"
          color="inherit"
          selected={!!matchPath(location.pathname, "/dashboard")}
        >
          <FormattedMessage id="components.header.menu.dashboard" />
        </MenuItem>
        <MenuItem
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
