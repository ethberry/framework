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
            <FormattedMessage id="pages.dashboard.mechanics.drop.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/drops">
          <ListItemIcon>
            <AccessTime />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.drop.main" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
