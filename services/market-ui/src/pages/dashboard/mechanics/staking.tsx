import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Casino, Savings } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Staking: FC = () => {
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
        <ListItem button component={RouterLink} to="/staking/rules">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.rules.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking/stakes">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.stakes.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking/leaderboard">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.leaderboard.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
