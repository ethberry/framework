import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paragliding } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Claim: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.claim.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/claims">
          <ListItemIcon>
            <Paragliding />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.claim.main" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
