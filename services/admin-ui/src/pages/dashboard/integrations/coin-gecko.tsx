import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid, WaterfallChart } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const CoinGeckoSection: FC = () => {
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
        <ListItem button component={RouterLink} to="/coin-gecko/rates">
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.coin-gecko.rates" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/coin-gecko/ohlc">
          <ListItemIcon>
            <WaterfallChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.coin-gecko.ohlc" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
