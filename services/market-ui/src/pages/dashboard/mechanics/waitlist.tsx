import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { TimerOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const WaitListSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.waitlist" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/waitlist/item">
          <ListItemIcon>
            <TimerOutlined />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.waitlist.item.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
