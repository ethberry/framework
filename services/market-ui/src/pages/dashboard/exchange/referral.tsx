import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Leaderboard, Share, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const ReferralSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.exchange.referral" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/referral/cabinet">
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.cabinet.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/referral/leaderboard">
          <ListItemIcon>
            <Leaderboard />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.leaderboard.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/referral/report/search">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.report.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/referral/report/chart">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.chart.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
