import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { optionsLock } from "../../../utils/config";

export const AssetPromoSection: FC = () => {
  if (!optionsLock("AssetPromoSection")) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.promo" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/promos">
          <ListItemIcon>
            <AccessTime />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.promo.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
