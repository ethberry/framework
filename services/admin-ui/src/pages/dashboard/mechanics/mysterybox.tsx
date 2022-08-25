import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, Inventory } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Mysterybox: FC = () => {
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
        <ListItem button component={RouterLink} to="/mysterybox-contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mysterybox.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/mysterybox-boxes">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mysterybox.boxes.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
