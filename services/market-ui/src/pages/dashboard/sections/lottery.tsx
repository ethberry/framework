import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Casino } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Lottery: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.lottery.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/lottery/ticket">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.lottery.ticket" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/lottery/leaderboard">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.lottery.leaderboard" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
