import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Bookmark, Category, Email, Photo, Storage, Tune } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const EcommerceSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.ecommerce.store.title" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/ecommerce/categories">
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.categories" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/products">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.products" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/parameters">
          <ListItemIcon>
            <Tune />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.parameters" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/promos">
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.promos" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/kanban">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.kanban" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/orders">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.orders" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/statistics">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.statistics" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ecommerce/photos">
          <ListItemIcon>
            <Photo />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.photos" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
