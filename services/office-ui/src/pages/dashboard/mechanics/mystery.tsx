import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, Inventory, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { ChainLinkSupportedChains, NodeEnv } from "@framework/types";

export const MysterySection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.mechanics.mystery" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/mystery/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mystery.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/mystery/boxes">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mystery.boxes.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/mystery/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.mystery.tokens.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
