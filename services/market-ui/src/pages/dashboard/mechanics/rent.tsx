import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { CarRental } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const RentSection: FC = () => {
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
        <ListItem button component={RouterLink} to="/rent">
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
