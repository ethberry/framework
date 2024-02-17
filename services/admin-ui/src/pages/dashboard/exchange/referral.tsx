import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { BarChart, Groups } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";
import { optionsLock } from "../../../utils/lock";

export const ReferralSection: FC = () => {
  if (!optionsLock("ReferralSection")) {
    return null;
  }

  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.mechanics.referral" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/referral/report/search">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.report.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/referral/program">
          <ListItemIcon>
            <Groups />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.program.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
