import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid, RecentActors } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const ChainLinkSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.chain-link" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/chain-link">
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.chain-link.fund" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/chain-link">
          <ListItemIcon>
            <RecentActors />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.chain-link.subscription" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
