import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { MarkunreadMailbox, Token } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const ClaimSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.claim" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/claims/templates">
          <ListItemIcon>
            <MarkunreadMailbox />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.claims.template.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/claims/tokens">
          <ListItemIcon>
            <Token />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.claims.token.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
