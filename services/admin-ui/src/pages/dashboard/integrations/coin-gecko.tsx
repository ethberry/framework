import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid, WaterfallChart } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { optionsLock } from "../../../utils/config";

export const CoinGeckoSection: FC = () => {
  if (!optionsLock("CoinGeckoSection")) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.coin-gecko" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/coin-gecko/rates">
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.coin-gecko.rates" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/coin-gecko/ohlc">
          <ListItemIcon>
            <WaterfallChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.coin-gecko.ohlc" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
