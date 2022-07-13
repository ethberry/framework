import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront, Paragliding, AccountBalance, Construction } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Mechanics: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/vesting">
          <ListItemIcon>
            <AccountBalance />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.vesting" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/airdrop">
          <ListItemIcon>
            <Paragliding />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.airdrop" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/craft">
          <ListItemIcon>
            <Construction />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.craft" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.stake" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking/leaderboard">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.leaderboard" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking/reward">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.reward" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
