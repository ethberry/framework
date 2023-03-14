import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Bookmark, Category, Email, Photo, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Ecommerce: FC = () => {
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
        <ListItem button component={RouterLink} to="/categories">
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.categories" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/products">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.products" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/promos">
          <ListItemIcon>
            <Email />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.promos" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/kanban">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.kanban" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/orders">
          <ListItemIcon>
            <Bookmark />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.orders" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/statistics">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.ecommerce.store.statistics" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/photos">
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
