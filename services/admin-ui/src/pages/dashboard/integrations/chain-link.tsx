import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { ChainLinkV2SupportedChains } from "@framework/types";
import { NodeEnv } from "@gemunion/constants";

export const ChainLinkSection: FC = () => {
  const { chainId = 0 } = useWeb3React();

  // This was broken again when ChainLink introduces V2Plus so I decided to disable this block
  // if (process.env.NODE_ENV === NodeEnv.development) {
  //   return null;
  // }

  if (process.env.NODE_ENV === NodeEnv.production && !ChainLinkV2SupportedChains[chainId]) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.chain-link" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/chain-link">
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.chain-link.manage" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
