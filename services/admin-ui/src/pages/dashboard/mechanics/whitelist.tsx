import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Timer } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Whitelist: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.whitelist" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/whitelist">
          <ListItemIcon>
            <Timer />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.whitelist.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
