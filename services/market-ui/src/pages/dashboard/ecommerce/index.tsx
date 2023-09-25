import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Bookmark, ShoppingCart, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

import { StyledPaper } from "../styled";

export const EcommerceSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
    return null;
  }

  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.ecommerce.title" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/ecommerce/products">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.products" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/orders">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.orders" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/checkout">
          <ListItemIcon>
            <ShoppingCart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.checkout" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
