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
        <ListItemButton component={RouterLink} to="/recipes/craft">
          <ListItemIcon>
            <Construction />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.recipes.craft.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/recipes/dismantle">
          <ListItemIcon>
            <Hardware />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.recipes.dismantle.title" />
          </ListItemText>
        </ListItemButton>
        {isDevelopment ? (
          <ListItemButton component={RouterLink} to="/recipes/merge">
            <ListItemIcon>
              <Merge />
            </ListItemIcon>
            <ListItemText>
              <FormattedMessage id="pages.recipes.merge.title" />
            </ListItemText>
          </ListItemButton>
        ) : null}
      </List>
    </Paper>
  );
};
