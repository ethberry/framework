import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const CoinGeckoSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
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
        <ListItem button component={RouterLink} to="/coin-gecko">
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.coin-gecko.rates" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
