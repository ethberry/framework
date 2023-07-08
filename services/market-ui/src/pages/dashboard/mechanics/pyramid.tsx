import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Casino, EmojiEvents, Savings } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const PyramidSection: FC = () => {
  const disabled = process.env.NODE_ENV === "production";

  if (disabled) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.pyramid" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/pyramid/rules">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.rules.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pyramid/stakes">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.deposit.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/pyramid/leaderboard">
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.leaderboard.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
