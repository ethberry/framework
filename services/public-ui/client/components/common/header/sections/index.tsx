import React, {FC, Fragment, MouseEvent, useContext, useState} from "react";
import {FormattedMessage, useIntl} from "react-intl";
import {useSnackbar} from "notistack";
import {matchPath, useHistory, useLocation} from "react-router";
import {Avatar, Button, IconButton, Menu, MenuItem} from "@material-ui/core";
import {Link as RouterLink, NavLink as RouterNavLink} from "react-router-dom";

import {IUserContext, UserContext} from "@trejgun/provider-user";
import {ApiContext, ApiError} from "@trejgun/provider-api";
import {IUser} from "@trejgun/solo-types";

import useStyles from "./styles";

export const Sections: FC = () => {
  const history = useHistory();
  const location = useLocation();
  const {enqueueSnackbar} = useSnackbar();
  const {formatMessage} = useIntl();

  const classes = useStyles();
  const [anchor, setAnchor] = useState<Element | null>(null);

  const user = useContext<IUserContext<IUser>>(UserContext);
  const api = useContext(ApiContext);

  const handleMenuOpen = (event: MouseEvent): void => {
    setAnchor(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchor(null);
  };

  const logout = (e: MouseEvent): Promise<void> => {
    e.preventDefault();
    handleMenuClose();
    return api
      .fetchJson({
        method: "POST",
        url: "/auth/logout",
        data: {
          refreshToken: api.getToken()?.refreshToken,
        },
      })
      .then(() => {
        user.logOut();
        api.setToken(null);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({id: `snackbar.${e.message}`}), {variant: "error"});
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({id: "snackbar.error"}), {variant: "error"});
        }
      })
      .finally(() => {
        history.push("/login");
      });
  };

  if (!user.isAuthenticated()) {
    if (matchPath(location.pathname, {path: "/login"})) {
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
        <Avatar
          alt={`${user.profile.firstName} ${user.profile.lastName}`}
          src={user.profile.imageUrl ?? "/img/icons/user.png"}
        />
      </IconButton>
      <Menu id="material-appbar" anchorEl={anchor} open={!!anchor} onClose={handleMenuClose}>
        <MenuItem
          component={RouterNavLink}
          to="/dashboard"
          color="inherit"
          selected={
            !!matchPath(location.pathname, {
              path: ["/dashboard"],
            })
          }
        >
          <FormattedMessage id="components.header.menu.dashboard" />
        </MenuItem>
        <MenuItem
          color="inherit"
          component={RouterNavLink}
          to="/profile"
          selected={
            !!matchPath(location.pathname, {
              path: "/profile",
            })
          }
        >
          <FormattedMessage id="components.header.menu.profile" />
        </MenuItem>
        <MenuItem to="/about-us" component={RouterNavLink}>
          <FormattedMessage id="components.header.menu.about" />
        </MenuItem>
        <MenuItem to="/logout" onClick={logout} component={RouterNavLink}>
          <FormattedMessage id="components.header.menu.logout" />
        </MenuItem>
      </Menu>
    </Fragment>
  );
};
