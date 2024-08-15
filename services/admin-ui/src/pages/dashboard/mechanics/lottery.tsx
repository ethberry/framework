import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, ConfirmationNumber, Savings, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { BusinessType, ChainLinkV2SupportedChains } from "@framework/types";
import { NodeEnv } from "@gemunion/constants";

export const LotterySection: FC = () => {
  const { chainId = 0 } = useWeb3React();

  if (process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return null;
  }

  if (process.env.NODE_ENV === NodeEnv.production && !ChainLinkV2SupportedChains[chainId]) {
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
        <ListItemButton component={RouterLink} to="/lottery/rounds">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.rounds.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/lottery/ticket/contracts">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.lottery.tickets.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/lottery/ticket/tokens">
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
