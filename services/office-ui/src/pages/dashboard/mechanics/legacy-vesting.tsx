import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AccountBalance } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const LegacyVestingSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.legacy-vesting" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/legacy-vesting/contracts">
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.legacy-vesting.contracts.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
