import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Upgrade } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const GradeSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.grade" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/grades">
          <ListItemIcon>
            <Upgrade />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.grade.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
