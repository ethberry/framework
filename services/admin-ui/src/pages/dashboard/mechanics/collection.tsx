import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AutoAwesomeMotion, Collections as CollectionsIcon, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const CollectionSection: FC = () => {
  const disabled = process.env.NODE_ENV !== NodeEnv.development;

  if (disabled) {
    return null;
  }

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
        <ListItem button component={RouterLink} to="/collection/contracts">
          <ListItemIcon>
            <CollectionsIcon />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.collection.contracts" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/collection/templates">
          <ListItemIcon>
            <AutoAwesomeMotion />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.collection.templates" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/collection/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.collection.tokens" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
