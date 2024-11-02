import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { AccountBalance } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";

export const LegacyVestingSection: FC = () => {
  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.legacy-vesting" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/legacy-vesting">
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.legacy-vesting.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
