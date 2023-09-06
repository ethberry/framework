import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Construction, Hardware, Merge } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const RecipesSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.recipes" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/craft">
          <ListItemIcon>
            <Construction />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.craft.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/dismantle">
          <ListItemIcon>
            <Hardware />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dismantle.title" />
          </ListItemText>
        </ListItemButton>
        {isDevelopment ? (
          <ListItemButton component={RouterLink} to="/merge">
            <ListItemIcon>
              <Merge />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="pages.merge.title" />
            </ListItemText>
          </ListItemButton>
        ) : null}
      </List>
    </Paper>
  );
};
