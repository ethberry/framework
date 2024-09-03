import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections, Inventory, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { useUser } from "@gemunion/provider-user";
import { NodeEnv } from "@gemunion/constants";
import type { IUser } from "@framework/types";
import { BusinessType, ChainLinkV2SupportedChains, RatePlanType } from "@framework/types";

export const LootSection: FC = () => {
  const { profile } = useUser<IUser>();
  const { chainId = 0 } = useWeb3React();

  if (profile?.merchant?.ratePlan === RatePlanType.BRONZE) {
    return null;
  }

  if (process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return null;
  }

  if (process.env.NODE_ENV === NodeEnv.production && !ChainLinkV2SupportedChains[chainId]) {
    return null;
  }

  if (process.env.NODE_ENV === NodeEnv.production) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.loot" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/loot/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.loot.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/loot/boxes">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.loot.boxes.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/loot/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.loot.tokens.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
