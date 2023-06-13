import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Casino, ConfirmationNumber, EmojiEvents } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const RaffleSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.raffle" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/raffle/purchase">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.raffle.purchase.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/raffle/ticket">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.raffle.tickets.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/raffle/leaderboard">
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.raffle.leaderboard.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};