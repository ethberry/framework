import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, Inventory } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Mystery: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.mystery" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/mystery-contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mystery.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/mystery-boxes">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mystery.boxes.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
