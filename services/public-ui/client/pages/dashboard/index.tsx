import React, { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { AccountCircle, Bookmark, Inbox } from "@material-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { PageHeader } from "@gemunion/material-ui-page-header";

import useStyles from "./styles";

export const Dashboard: FC = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <PageHeader message="pages.dashboard.title" />

      <List component="nav">
        <ListItem button component={RouterLink} to="/products">
          <ListItemIcon>
            <Inbox />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.products" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/merchants">
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.merchants" />
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
      </List>
    </div>
  );
};
