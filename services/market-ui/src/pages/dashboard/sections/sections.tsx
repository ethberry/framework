import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Sections: FC = () => {
  return (
    <List
      component="nav"
      subheader={
        <ListSubheader>
          <FormattedMessage id="pages.dashboard.sections.title" />
        </ListSubheader>
      }
    >
      <ListItem button component={RouterLink} to="/marketplace">
        <ListItemIcon>
          <Storefront />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.sections.marketplace" />
        </ListItemText>
      </ListItem>
      <ListItem button component={RouterLink} to="/assets">
        <ListItemIcon>
          <Storefront />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.sections.assets" />
        </ListItemText>
      </ListItem>
      <ListItem button component={RouterLink} to="/craft">
        <ListItemIcon>
          <Storefront />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.sections.craft" />
        </ListItemText>
      </ListItem>
      <ListItem button component={RouterLink} to="/leaderboard">
        <ListItemIcon>
          <Storefront />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.sections.leaderboard" />
        </ListItemText>
      </ListItem>
    </List>
  );
};
