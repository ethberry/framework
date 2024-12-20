import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { PushPin } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@gemunion/constants";

import { StyledPaper } from "../styled";

export const IpfsSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.integrations.ipfs" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/ipfs/infura">
          <ListItemIcon>
            <PushPin />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ipfs.infura.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ipfs/pinata">
          <ListItemIcon>
            <PushPin />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ipfs.pinata.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ipfs/web3-storage">
          <ListItemIcon>
            <PushPin />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ipfs.web3Storage.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/ipfs/nft-storage">
          <ListItemIcon>
            <PushPin />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ipfs.nftStorage.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
