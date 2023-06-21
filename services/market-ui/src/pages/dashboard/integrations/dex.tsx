import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const DexSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.dex.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/dex/1inch">
          <ListItemIcon>
            <CurrencyExchange />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dex.1inch.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/dex/uniswap">
          <ListItemIcon>
            <CurrencyExchange />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dex.uniswap.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
