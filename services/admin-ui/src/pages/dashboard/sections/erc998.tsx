import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AutoAwesomeMotion, Collections, Construction, Inventory, Paragliding, Storage } from "@mui/icons-material";
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
        <ListItem button component={RouterLink} to="/erc998-collections">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc998.collections" />
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
        <ListItem button component={RouterLink} to="/erc998-airdrops">
          <ListItemIcon>
            <Paragliding />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc998.airdrop" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc998-dropboxes">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc998.dropbox" />
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
        <ListItem button component={RouterLink} to="/erc998-recipes">
          <ListItemIcon>
            <Construction />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc998.recipes" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
