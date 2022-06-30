import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { BarChart, Casino, Construction, Inventory, Paragliding } from "@mui/icons-material";
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
        <ListItem button component={RouterLink} to="/airdrops">
          <ListItemIcon>
            <Paragliding />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.airdrops" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/dropboxes">
          <ListItemIcon>
            <Inventory />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.dropboxes" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/exchange-rules">
          <ListItemIcon>
            <Construction />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.exchange-rules" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking-rules">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.staking-rules" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/stakes">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.mechanics.stakes" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
