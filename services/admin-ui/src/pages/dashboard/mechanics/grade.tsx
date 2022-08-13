import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Upgrade } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Grade: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.grade.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/grades">
          <ListItemIcon>
            <Upgrade />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.grade.main" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
