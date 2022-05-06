import { FC } from "react";
import { Divider, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Construction, Filter, SettingsApplications, Storage, Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { useUser } from "@gemunion/provider-user";
import { IUser, UserRole } from "@framework/types";

export const Tokens: FC = () => {
  const user = useUser<IUser>();

  if (!user.profile.userRoles.includes(UserRole.ADMIN)) {
    return null;
  }

  return (
    <List
      component="nav"
      subheader={
        <ListSubheader>
          <FormattedMessage id="pages.dashboard.tokens.title" />
        </ListSubheader>
      }
    >
      <ListItem button component={RouterLink} to="/erc20-tokens">
        <ListItemIcon>
          <Storefront />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc20-tokens" />
        </ListItemText>
      </ListItem>
      <Divider />
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
      <ListItem button component={RouterLink} to="/erc721-dropboxes">
        <ListItemIcon>
          <Storage />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc721-dropbox" />
        </ListItemText>
      </ListItem>
      <ListItem button component={RouterLink} to="/erc721-airdrops">
        <ListItemIcon>
          <Storage />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.tokens.erc721-airdrop" />
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
      <Divider />
      <ListItem button component={RouterLink} to="/blockchain">
        <ListItemIcon>
          <SettingsApplications />
        </ListItemIcon>
        <ListItemText>
          <FormattedMessage id="pages.dashboard.settings.blockchain" />
        </ListItemText>
      </ListItem>
    </List>
  );
};
