import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { ChangeHistory } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Pyramid: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.pyramid" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/pyramid">
          <ListItemIcon>
            <ChangeHistory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.pyramid.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
