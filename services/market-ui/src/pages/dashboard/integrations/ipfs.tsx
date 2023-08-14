import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { PushPin } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

export const IpfsSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.ipfs" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/ipfs/infura">
          <ListItemIcon>
            <PushPin />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ipfs.infura.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ipfs/pinata">
          <ListItemIcon>
            <PushPin />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ipfs.pinata.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ipfs/web3-storage">
          <ListItemIcon>
            <PushPin />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ipfs.web3Storage.title" />
          </ListItemText>
        </ListItem>
        <ListItem button component={RouterLink} to="/ipfs/nft-storage">
          <ListItemIcon>
            <PushPin />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.ipfs.nftStorage.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
