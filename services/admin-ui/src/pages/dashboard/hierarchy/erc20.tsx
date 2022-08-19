import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const Erc20Sections: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.hierarchy.erc20.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/erc20-contracts">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.hierarchy.erc20.contracts" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
