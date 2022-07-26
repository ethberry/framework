import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AccountBalance, Construction, Inventory, Paragliding } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Mechanics: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/vesting">
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.vesting" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/claim">
          <ListItemIcon>
            <Paragliding />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.claim" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/lootboxes">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.lootboxes" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/craft">
          <ListItemIcon>
            <Construction />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.craft" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
