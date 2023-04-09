import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Filter, Storage, Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const MysterySection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.mysterybox" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/mystery/contracts">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mystery.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/mystery/boxes">
          <ListItemIcon>
            <Filter />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mystery.boxes.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/mystery/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mystery.tokens.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
