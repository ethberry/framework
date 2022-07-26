import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Construction, Inventory, Paragliding, Savings, Upgrade } from "@mui/icons-material";
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
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.vesting" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/claims">
          <ListItemIcon>
            <Paragliding />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.claims" />
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
        <ListItem button component={RouterLink} to="/grades">
          <ListItemIcon>
            <Upgrade />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.grade" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
