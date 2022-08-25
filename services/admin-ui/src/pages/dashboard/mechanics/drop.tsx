import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Drop: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.drop" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/drops">
          <ListItemIcon>
            <AccessTime />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.drop.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
