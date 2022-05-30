import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, Construction, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Erc1155Section: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.erc1155.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc1155-collections">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc1155.collections" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc1155-tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc1155.tokens" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc1155-recipes">
          <ListItemIcon>
            <Construction />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc1155.recipes" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
