import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Email, MenuBook, PeopleAlt, Settings, SignalCellularAlt, Storefront } from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { useUser } from "@gemunion/provider-user";
import { IUser, UserRole } from "@framework/types";

export const AdminSection: FC = () => {
  const { profile } = useUser<IUser>();

  if (!profile.userRoles.includes(UserRole.ADMIN)) {
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
        <ListItemButton component={RouterLink} to="/users">
          <ListItemIcon>
            <PeopleAlt />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.users" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/settings">
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.settings" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/pages">
          <ListItemIcon>
            <MenuBook />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.pages" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/emails">
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.emails" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/merchants">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.merchants" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/rate-plans">
          <ListItemIcon>
            <SignalCellularAlt />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.admin.rate-plans" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
