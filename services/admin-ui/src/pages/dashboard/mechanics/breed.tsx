import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { ConfirmationNumber, Savings } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const BreedSection: FC = () => {
  const isProd = process.env.NODE_ENV === NodeEnv.production;

  if (isProd) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.breed" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/breed/breeds">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.breed.breeds.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/breed/history">
          <ListItemIcon>
            <ConfirmationNumber />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.breed.history.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
