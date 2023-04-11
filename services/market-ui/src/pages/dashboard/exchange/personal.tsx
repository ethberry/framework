import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const PersonalSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.personal" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/wallet">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.wallet.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/transactions">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.transactions.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
