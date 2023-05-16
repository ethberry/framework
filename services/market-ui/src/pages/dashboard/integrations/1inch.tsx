import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const OneInchSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.1inch" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/1inch">
          <ListItemIcon>
            <CurrencyExchange />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.1inch.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
