import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Collections } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { optionsLock } from "../../../utils/lock";

export const PaymentSplitterSection: FC = () => {
  if (!optionsLock("PaymentSplitterSection")) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.payment-splitter" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/payment-splitter/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.payment-splitter.contracts.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
