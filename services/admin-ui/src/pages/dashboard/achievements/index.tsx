import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { FormatListNumberedRtl, SportsScore } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const AchievementsSection: FC = () => {
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
      </List>
    </Paper>
  );
};
