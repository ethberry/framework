import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, FormatListNumberedRtl, SportsScore } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@gemunion/constants";

export const AchievementsSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.achievements.title" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/achievements/rules">
          <ListItemIcon>
            <SportsScore />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.achievements.rules" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/achievements/levels">
          <ListItemIcon>
            <FormatListNumberedRtl />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.achievements.levels" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/achievements/report">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.achievements.report" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
