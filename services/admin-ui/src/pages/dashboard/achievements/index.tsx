import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, FormatListNumberedRtl, SportsScore } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const AchievementsSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.achievements.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/achievements/rules">
          <ListItemIcon>
            <SportsScore />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.achievements.rules" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/achievements/levels">
          <ListItemIcon>
            <FormatListNumberedRtl />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.achievements.levels" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/achievements/report">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.achievements.report" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
