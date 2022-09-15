import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, Rule } from "@mui/icons-material";

import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Pyramid: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.pyramid" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/pyramid/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pyramid/rules">
          <ListItemIcon>
            <Rule />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.rules.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
