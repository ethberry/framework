import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Collections, Rule, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const PyramidSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.mechanics.pyramid" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/pyramid/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.contracts.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pyramid/rules">
          <ListItemIcon>
            <Rule />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.rules.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pyramid/report">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.report.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pyramid/chart">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.chart.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
