import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Bookmark, Category, Email, Photo, Storage, Tune } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const EcommerceSection: FC = () => {
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
        <ListItem button component={RouterLink} to="/ecommerce/categories">
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.categories" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/products">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.products" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/parameters">
          <ListItemIcon>
            <Tune />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.parameters" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/promos">
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.promos" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/kanban">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.kanban" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/orders">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.orders" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/statistics">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.statistics" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ecommerce/photos">
          <ListItemIcon>
            <Photo />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.photos" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
