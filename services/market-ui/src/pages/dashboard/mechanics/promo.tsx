import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { AccessTime } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@gemunion/constants";

import { StyledPaper } from "../styled";

export const AssetPromoSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.mechanics.promo" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/promos">
          <ListItemIcon>
            <AccessTime />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.promo-list.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
