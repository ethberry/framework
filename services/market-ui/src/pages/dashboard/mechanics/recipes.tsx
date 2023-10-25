import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Construction, Merge } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";

export const RecipesSection: FC = () => {
  return (
    <StyledPaper>
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
            <FormattedMessage id="pages.recipes.craft-list.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/recipes/merge">
          <ListItemIcon>
            <Merge />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.recipes.merge-list.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
