import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Staking: FC = () => {
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
        <ListItem button component={RouterLink} to="/staking-rules">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.blockchain.staking" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/stakes">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.blockchain.stakes" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
