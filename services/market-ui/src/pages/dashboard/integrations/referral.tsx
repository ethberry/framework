import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Leaderboard, RecordVoiceOver, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Referral: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.referral.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/referral/link">
          <ListItemIcon>
            <RecordVoiceOver />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.integrations.referral.link" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/referral/leaderboard">
          <ListItemIcon>
            <Leaderboard />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.integrations.referral.leaderboard" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/referral/reward">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.integrations.referral.reward" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
