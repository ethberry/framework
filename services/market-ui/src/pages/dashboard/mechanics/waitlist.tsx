import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { TimerOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";

export const WaitListSection: FC = () => {
  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.wait-list" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/wait-list/item">
          <ListItemIcon>
            <TimerOutlined />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.wait-list.item.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
