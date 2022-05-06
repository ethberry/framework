import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { PeopleAlt } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { useUser } from "@gemunion/provider-user";
import { IUser, UserRole } from "@framework/types";

export const Admin: FC = () => {
  const user = useUser<IUser>();

  if (!user.profile.userRoles.includes(UserRole.ADMIN)) {
    return null;
  }

  return (
    <List
      component="nav"
      subheader={
        <ListSubheader>
          <FormattedMessage id="pages.dashboard.admin.title" />
        </ListSubheader>
      }
    >
      <ListItem button component={RouterLink} to="/users">
        <ListItemIcon>
          <PeopleAlt />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.admin.users" />
        </ListItemText>
      </ListItem>
    </List>
  );
};
