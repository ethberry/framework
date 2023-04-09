import { FC } from "react";
import { List, ListItem, ListItemIcon, ListItemText, ListSubheader, Paper } from "@mui/material";
import { Storefront } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

export const FeedbackSection: FC = () => {
  return (
    <Paper sx={{ mb: 2 }}>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.infrastructure.feedback.title" />
          </ListSubheader>
        }
      >
        <ListItem button component={RouterLink} to="/feedback">
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.dashboard.infrastructure.feedback.form" />
          </ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};
