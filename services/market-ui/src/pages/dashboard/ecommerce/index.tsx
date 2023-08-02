import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Bookmark, ShoppingCart, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const EcommerceSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.ecommerce.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/ecommerce/products">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.products" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/orders">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.orders" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/checkout">
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.checkout" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
