import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Casino, EmojiEvents, Savings } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

import { StyledPaper } from "../styled";

export const PonziSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
    return null;
  }

  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.ponzi" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/ponzi/rules">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.rules.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ponzi/stakes">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.deposit.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ponzi/leaderboard">
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ponzi.leaderboard.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
