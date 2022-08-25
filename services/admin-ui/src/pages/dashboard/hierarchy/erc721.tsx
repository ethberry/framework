import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AutoAwesomeMotion, Collections, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Erc721Section: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.hierarchy.erc721" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc721-contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc721.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc721-templates">
          <ListItemIcon>
            <AutoAwesomeMotion />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc721.templates.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc721-tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc721.tokens.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
