import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Personal: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.personal.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/my-assets">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.personal.assets" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/my-auctions">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.personal.auctions" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/my-wallet">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.personal.wallet" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
