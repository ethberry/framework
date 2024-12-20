import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@gemunion/constants";

import { StyledPaper } from "../styled";

export const WrapperSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.mechanics.wrapper" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/wrapper-tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.wrapper.tokens.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
