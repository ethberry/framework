import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { CarRental } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@gemunion/constants";

import { StyledPaper } from "../styled";

export const RentSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.mechanics.rent" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/rent">
          <ListItemIcon>
            <CarRental />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.rent.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
