import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Savings, ConfirmationNumber } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Lottery: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.lottery.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/lottery/rounds">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.lottery.rounds" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/lottery/tickets">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.lottery.tickets" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
