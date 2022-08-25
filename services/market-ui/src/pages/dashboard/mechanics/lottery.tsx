import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Casino, ConfirmationNumber } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Lottery: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.lottery" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/lottery/purchase">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.purchase.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/lottery/ticket">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.tickets.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/lottery/leaderboard">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.leaderboard.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
