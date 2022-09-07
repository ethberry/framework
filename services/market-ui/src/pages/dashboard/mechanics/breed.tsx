import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Pets } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Breed: FC = () => {
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
        <ListItem button component={RouterLink} to="/breed">
          <ListItemIcon>
            <Pets />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.breed.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
