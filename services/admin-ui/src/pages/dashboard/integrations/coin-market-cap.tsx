import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { optionsLock } from "../../../utils/config";

export const CoinMarketCapSection: FC = () => {
  if (!optionsLock("CoinMarketCapSection")) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.coin-market-cap" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/coin-market-cap/rates">
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.coin-market-cap.rates" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
