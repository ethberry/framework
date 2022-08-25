import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const ChainLink: FC = () => {
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
      </List>
    </Paper>
  );
};
