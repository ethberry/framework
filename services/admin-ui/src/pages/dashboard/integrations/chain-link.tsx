import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Paid } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useWeb3React } from "@web3-react/core";

export const ChainLinkSection: FC = () => {
  const { chainId } = useWeb3React();

  if (!(chainId === 10000 || chainId === 10001)) {
    return null;
  }
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.integrations.chain-link" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/chain-link">
          <ListItemIcon>
            <Paid />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.chain-link.manage" />
          </ListItemText>
        </ListItemButton>
      </List>
    </Paper>
  );
};
