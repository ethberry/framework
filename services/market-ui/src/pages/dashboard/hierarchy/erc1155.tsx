import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storage, Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const Erc1155Section: FC = () => {
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
            <FormattedMessage id="pages.dashboard.hierarchy.erc1155" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc1155/contracts">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc1155.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc1155/templates">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc1155.templates.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc1155/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc1155.tokens.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
