import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Wallet: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.wallet.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/wallet/balances">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.wallet.balances" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/wallet/payees">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.wallet.payees" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
