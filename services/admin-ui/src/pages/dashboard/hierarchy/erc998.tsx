import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { AutoAwesomeMotion, Collections, Extension, Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { BusinessType } from "@framework/types";

export const Erc998Section: FC = () => {
  if (process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.hierarchy.erc998" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/erc998/contracts">
          <ListItemIcon>
            <Collections />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc998.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/erc998/templates">
          <ListItemIcon>
            <AutoAwesomeMotion />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc998.templates.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/erc998/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc998.tokens.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/erc998/composition">
          <ListItemIcon>
            <Extension />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.erc998.composition.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
