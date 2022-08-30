import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { MarkunreadMailbox } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Claim: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.claim" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/claim">
          <ListItemIcon>
            <MarkunreadMailbox />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.claim.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
