import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Casino, Savings, BarChart } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Staking: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.staking.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/staking/rules">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.staking.rules" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking/stakes">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.staking.stakes" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking/leaderboard">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.staking.leaderboard" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
