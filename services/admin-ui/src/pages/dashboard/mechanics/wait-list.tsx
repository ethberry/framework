import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, HourglassBottom, Person } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const WaitListSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.wait-list" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/wait-list/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.wait-list.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/wait-list/list">
          <ListItemIcon>
            <HourglassBottom />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.wait-list.list.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/wait-list/item">
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.wait-list.item.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
