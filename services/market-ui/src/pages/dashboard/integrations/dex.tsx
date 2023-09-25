import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

import { StyledPaper } from "../styled";

export const DexSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
    return null;
  }

  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.dex.title" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/dex/1inch">
          <ListItemIcon>
            <CurrencyExchange />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dex.1inch.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/dex/uniswap">
          <ListItemIcon>
            <CurrencyExchange />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dex.uniswap.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
