import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Collections, Rule, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@gemunion/constants";

export const PonziSection: FC = () => {
  const isProd = process.env.NODE_ENV === NodeEnv.production;

  if (isProd) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.ponzi" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/ponzi/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ponzi/rules">
          <ListItemIcon>
            <Rule />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.rules.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ponzi/report">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.report.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ponzi/chart">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.chart.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
