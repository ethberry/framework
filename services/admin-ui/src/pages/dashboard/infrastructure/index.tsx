import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Email, MenuBook, PeopleAlt, Settings } from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const AdminSection: FC = () => {
  const disabled = process.env.NODE_ENV === "production";

  if (disabled) {
    return null;
  }

  if (process.env.GEMUNION_BUSINESS_MODEL === "B2B") {
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
      </List>
    </Paper>
  );
};
