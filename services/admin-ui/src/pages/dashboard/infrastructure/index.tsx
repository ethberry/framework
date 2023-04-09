import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Email, MenuBook, PeopleAlt, Settings } from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { useUser } from "@gemunion/provider-user";
import { IUser, UserRole } from "@framework/types";

export const AdminSection: FC = () => {
  const user = useUser<IUser>();

  if (!user.profile.userRoles.includes(UserRole.ADMIN)) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/users">
          <ListItemIcon>
            <PeopleAlt />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.users" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/settings">
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.settings" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pages">
          <ListItemIcon>
            <MenuBook />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.pages" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/emails">
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.emails" />
          </ListItemText>
        </ListItem>
        {/* <ListItem button component={RouterLink} to="/payees"> */}
        {/*  <ListItemIcon> */}
        {/*    <Storefront /> */}
        {/*  </ListItemIcon> */}
        {/*  <ListItemText> */}
        {/*    <FormattedMessage id="pages.dashboard.infrastructure.admin.payees" /> */}
        {/*  </ListItemText> */}
        {/* </ListItem> */}
        {/* <ListItem button component={RouterLink} to="/payees/balances"> */}
        {/*  <ListItemIcon> */}
        {/*    <Storefront /> */}
        {/*  </ListItemIcon> */}
        {/*  <ListItemText> */}
        {/*    <FormattedMessage id="pages.dashboard.infrastructure.admin.balances" /> */}
        {/*  </ListItemText> */}
        {/* </ListItem> */}
      </List>
    </Paper>
  );
};
