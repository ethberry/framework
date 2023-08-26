import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Collections, Rule, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const PonziSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.mechanics.ponzi" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/ponzi/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ponzi/rules">
          <ListItemIcon>
            <Rule />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.rules.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ponzi/report">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.report.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ponzi/chart">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.chart.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
