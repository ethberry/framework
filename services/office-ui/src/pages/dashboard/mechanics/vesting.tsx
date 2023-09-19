import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AccountBalance, MarkunreadMailbox } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const VestingSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.vesting" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/vesting/contracts">
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.vesting.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/vesting/claims">
          <ListItemIcon>
            <MarkunreadMailbox />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.vesting.claims.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
