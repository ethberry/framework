import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { CurrencyExchange } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@ethberry/constants";

import { StyledPaper } from "../styled";

export const DexSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.integrations.dex.title" />
          </ListSubheader>
        }
      >
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
