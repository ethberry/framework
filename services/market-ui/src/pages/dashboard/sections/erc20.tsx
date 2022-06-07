import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Erc20Sections: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.erc20.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc20-vesting">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc20.vesting" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/erc20-staking">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.erc20.staking" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
