import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { ConfirmationNumber, Storage, Collections } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

import { ChainLinkV2SupportedChains, NodeEnv } from "@framework/types";

export const PredictionSection: FC = () => {
  const isProd = process.env.NODE_ENV === NodeEnv.production;
  const { chainId = 0 } = useWeb3React();

  if (isProd) {
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
            <FormattedMessage id="pages.dashboard.mechanics.prediction" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/prediction/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.prediction.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/prediction/questions">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.prediction.questions.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/prediction/answers">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.prediction.answers.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
