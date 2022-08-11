import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront, RecordVoiceOver, Leaderboard, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Marketplace: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.marketplace.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/marketplace">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.marketplace.primary" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/referral/link">
          <ListItemIcon>
            <RecordVoiceOver />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.marketplace.link" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/referral/leaderboard">
          <ListItemIcon>
            <Leaderboard />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.marketplace.leaderboard" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/referral/reward">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.marketplace.reward" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
