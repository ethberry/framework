import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const CoinMarketCap: FC = () => {
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
        <ListItem button component={RouterLink} to="/coin-market-cap/rates">
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.coin-market-cap.rates" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
