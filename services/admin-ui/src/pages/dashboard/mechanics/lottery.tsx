import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { ConfirmationNumber, Savings } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const LotterySection: FC = () => {
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
        <ListItem button component={RouterLink} to="/lottery/rounds">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.rounds.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/lottery/tickets">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.tickets.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
