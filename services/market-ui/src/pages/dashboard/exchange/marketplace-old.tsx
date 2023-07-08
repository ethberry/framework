import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const MarketplaceSectionOld: FC = () => {
  const disabled = process.env.NODE_ENV === "production";

  if (disabled) {
    return null;
  }

  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.exchange.marketplace" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/marketplace">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.marketplace.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
