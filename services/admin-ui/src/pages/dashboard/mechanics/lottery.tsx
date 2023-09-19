import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, ConfirmationNumber, Savings, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { BusinessType } from "@framework/types";

export const LotterySection: FC = () => {
  if (process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return null;
  }

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
        <ListItemButton component={RouterLink} to="/lottery/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/lottery/tickets">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.tickets.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/lottery/rounds">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.rounds.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/lottery/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.tokens.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
