import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AutoAwesomeMotion, Collections, Construction, Inventory, Paragliding, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Erc721Section: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.erc721.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc721-collections">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc721.collections" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc721-templates">
          <ListItemIcon>
            <AutoAwesomeMotion />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc721.templates" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc721-airdrops">
          <ListItemIcon>
            <Paragliding />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc721.airdrop" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc721-dropboxes">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc721.dropbox" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc721-tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc721.tokens" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc721-recipes">
          <ListItemIcon>
            <Construction />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc721.recipes" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
