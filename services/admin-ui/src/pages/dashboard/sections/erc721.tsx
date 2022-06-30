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
            <FormattedMessage id="pages.dashboard.erc721.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc721-contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc721.contracts" />
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
        <ListItem button component={RouterLink} to="/erc721-tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc721.tokens" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
