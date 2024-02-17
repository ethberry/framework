import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Collections, Rule, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { optionsLock } from "../../../utils/config";

export const StakingSection: FC = () => {
  if (!optionsLock("StakingSection")) {
    return null;
  }

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
        <ListItemButton component={RouterLink} to="/staking/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/staking/rules">
          <ListItemIcon>
            <Rule />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.rules.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/staking/report">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.report.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/staking/chart">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.chart.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
