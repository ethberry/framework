import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AutoAwesomeMotion, Collections as CollectionsIcon, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Collections: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.collection" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/collections/contracts">
          <ListItemIcon>
            <CollectionsIcon />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.collections.contracts" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/collections/templates">
          <ListItemIcon>
            <AutoAwesomeMotion />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.collections.templates" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/collections/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.collections.tokens" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
