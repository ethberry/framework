import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Filter, Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";

export const MarketplaceSection: FC = () => {
  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.exchange.marketplace" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/marketplace/merchants">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.marketplace.merchants.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/marketplace/contracts">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.marketplace.contracts.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/marketplace/templates">
          <ListItemIcon>
            <Filter />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.marketplace.templates.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
