import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { MarkunreadMailbox } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";

export const ClaimSection: FC = () => {
  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.claim" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/claim">
          <ListItemIcon>
            <MarkunreadMailbox />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.claim.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
