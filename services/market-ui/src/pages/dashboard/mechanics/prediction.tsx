import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { Casino } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";

export const PredictionSection: FC = () => {
  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.prediction" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/prediction/question">
          <ListItemIcon>
            <Casino />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.prediction.question.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
