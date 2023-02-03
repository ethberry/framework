import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Pages: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.ecommerce.pages.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/pages/about-us">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.pages.about-us" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pages/faq">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.pages.faq" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pages/privacy-policy">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.pages.privacy-policy" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pages/terms-of-services">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.pages.terms-of-services" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
