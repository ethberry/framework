import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const PagesSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.infrastructure.pages.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/pages/about-us">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.pages.about-us" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pages/faq">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.pages.faq" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pages/privacy-policy">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.pages.privacy-policy" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pages/terms-of-services">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.pages.terms-of-services" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
