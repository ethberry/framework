import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, ConfirmationNumber, Savings, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { ChainLinkSupportedChains, NodeEnv } from "@framework/types";

export const RaffleSection: FC = () => {
  const { chainId = 0 } = useWeb3React();

  if (process.env.NODE_ENV === NodeEnv.production && !ChainLinkSupportedChains[chainId]) {
    return null;
  }

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
        <ListItemButton component={RouterLink} to="/raffle/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.raffle.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/raffle/rounds">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.raffle.rounds.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/raffle/ticket/contracts">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.raffle.tickets.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/raffle/ticket/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.raffle.tokens.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
