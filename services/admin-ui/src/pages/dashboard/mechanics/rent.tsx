import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { CarRental } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { NodeEnv } from "@framework/types";

export const RentSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
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
        <ListItem button component={RouterLink} to="/rents">
          <ListItemIcon>
            <CarRental />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.rent.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
