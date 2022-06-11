import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Casino, Sailing } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Seaport: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.blockchain.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/seaport">
          <ListItemIcon>
            <Sailing />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.blockchain.seaport" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/staking">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.blockchain.staking" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
