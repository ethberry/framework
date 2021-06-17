import React, {FC, useContext} from "react";
import {Divider, List, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {Bookmark, Category, Email, PeopleAlt, Photo, Storage, Storefront} from "@material-ui/icons";
import {Link as RouterLink} from "react-router-dom";
import {FormattedMessage} from "react-intl";

import {PageHeader} from "@trejgun/material-ui-page-header";

import useStyles from "./styles";
import {IUserContext, UserContext} from "@trejgun/provider-user";
import {IUser, UserRole} from "@trejgun/solo-types";

export const Dashboard: FC = () => {
  const classes = useStyles();
  const user = useContext<IUserContext<IUser>>(UserContext);
  const isAdmin = user.profile.userRoles.includes(UserRole.ADMIN);

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <List component="nav">
        <ListItem button component={RouterLink} to="/users">
          <ListItemIcon>
            <PeopleAlt />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.users" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/merchants">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.merchants" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/categories">
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.categories" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/products">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.products" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/orders">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.orders" />
          </ListItemText>
        </ListItem>
        {isAdmin ? (
          <ListItem button component={RouterLink} to="/promos">
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="pages.dashboard.promos" />
            </ListItemText>
          </ListItem>
        ) : null}
        <Divider />
        {isAdmin ? (
          <ListItem button component={RouterLink} to="/photos">
            <ListItemIcon>
              <Photo />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="pages.dashboard.photos" />
            </ListItemText>
          </ListItem>
        ) : null}
        {isAdmin ? (
          <ListItem button component={RouterLink} to="/emails">
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="pages.dashboard.emails" />
            </ListItemText>
          </ListItem>
        ) : null}
      </List>
    </div>
  );
};
