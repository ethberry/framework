import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Grade, Hive, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { useUser } from "@gemunion/provider-user";
import { IUser, UserRole } from "@framework/types";

export const MarketplaceSection: FC = () => {
  const { profile } = useUser<IUser>();

  if (!profile.userRoles.includes(UserRole.ADMIN)) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.exchange.marketplace.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/marketplace/report/search">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.exchange.marketplace.report" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/marketplace/report/chart">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.exchange.marketplace.chart" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/marketplace/report/rarity">
          <ListItemIcon>
            <Hive />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.exchange.marketplace.rarity" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/marketplace/report/grade">
          <ListItemIcon>
            <Grade />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.exchange.marketplace.grade" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
