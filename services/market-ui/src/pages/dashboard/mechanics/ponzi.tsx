import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Casino, EmojiEvents, Savings } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const PonziSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.ponzi" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/ponzi/rules">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.rules.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ponzi/stakes">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.deposit.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ponzi/leaderboard">
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.leaderboard.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
