import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AutoAwesomeMotion, Collections, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Erc998Section: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.erc998.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc998-contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc998.contracts" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc998-templates">
          <ListItemIcon>
            <AutoAwesomeMotion />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc998.templates" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc998-tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc998.tokens" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc998-composition">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc998.composition" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
