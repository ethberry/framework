import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { CarRental } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { optionsLock } from "../../../utils/lock";

export const RentSection: FC = () => {
  if (!optionsLock("RentSection")) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.rent" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/rents">
          <ListItemIcon>
            <CarRental />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.rent.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
