import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Casino, Savings, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Erc20Sections: FC = () => {
  return (
    <Paper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.tokens.erc20" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc20-tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.tokens.erc20-tokens" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc20-vesting">
          <ListItemIcon>
            <Savings />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.tokens.erc20-vesting" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc20-staking">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.tokens.erc20-staking" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
