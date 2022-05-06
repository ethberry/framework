import { FC } from "react";
import { Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Construction, Filter, Storage, Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Tokens: FC = () => {
  return (
    <List
      component="nav"
      subheader={
        <ListSubheader>
          <FormattedMessage id="pages.dashboard.tokens.title" />
        </ListSubheader>
      }
    >
      <ListItem button component={RouterLink} to="/erc721-collections">
        <ListItemIcon>
          <Storefront />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc721-collections" />
        </ListItemText>
      </ListItem>
      <ListItem button component={RouterLink} to="/erc721-templates">
        <ListItemIcon>
          <Filter />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc721-templates" />
        </ListItemText>
      </ListItem>
      <ListItem button component={RouterLink} to="/erc721-tokens">
        <ListItemIcon>
          <Storage />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc721-tokens" />
        </ListItemText>
      </ListItem>
      <Divider />
      <ListItem button component={RouterLink} to="/erc1155-collections">
        <ListItemIcon>
          <Storefront />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc1155-collections" />
        </ListItemText>
      </ListItem>
      <ListItem button component={RouterLink} to="/erc1155-tokens">
        <ListItemIcon>
          <Storage />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc1155-tokens" />
        </ListItemText>
      </ListItem>
      <ListItem button component={RouterLink} to="/erc1155-recipes">
        <ListItemIcon>
          <Construction />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc1155-recipes" />
        </ListItemText>
      </ListItem>
    </List>
  );
};
