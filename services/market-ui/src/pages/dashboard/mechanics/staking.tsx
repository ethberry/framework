import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Casino, EmojiEvents, Savings } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";

export const StakingSection: FC = () => {
  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.staking" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/staking/rules">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.rules.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/staking/deposits">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.deposit.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/staking/leaderboard">
          <ListItemIcon>
            <EmojiEvents />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.staking.leaderboard.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
