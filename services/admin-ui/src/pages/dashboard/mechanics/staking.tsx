import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Rule, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Staking: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.staking" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/staking/rules">
          <ListItemIcon>
            <Rule />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.rules.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking/report/search">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.report.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking/report/chart">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.integrations.marketplace.chart" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
