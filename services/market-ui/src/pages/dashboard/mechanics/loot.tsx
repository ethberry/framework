import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Filter, Storage, Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";
import { BusinessType } from "@framework/types";

export const LootSection: FC = () => {
  if (process.env.BUSINESS_TYPE === BusinessType.B2B) {
    return null;
  }

  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.lootbox" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/loot/contracts">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.loot.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/loot/boxes">
          <ListItemIcon>
            <Filter />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.loot.boxes.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/loot/tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.loot.tokens.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
