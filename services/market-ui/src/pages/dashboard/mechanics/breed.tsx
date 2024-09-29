import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Pets } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@ethberry/constants";

import { StyledPaper } from "../styled";

export const BreedSection: FC = () => {
  const isProd = process.env.NODE_ENV === NodeEnv.production;

  if (isProd) {
    return null;
  }

  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.breed" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/breed">
          <ListItemIcon>
            <Pets />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.breed.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
