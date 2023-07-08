import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storage } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const WrapperSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.mechanics.wrapper" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/wrapper-tokens">
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.wrapper.tokens.title" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
