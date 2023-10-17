import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { BarChart, Leaderboard, Share, Timeline } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

import { StyledPaper } from "../styled";

export const ReferralSection: FC = () => {
  const isDevelopment = process.env.NODE_ENV === NodeEnv.development;

  if (!isDevelopment) {
    return null;
  }

  return (
    <StyledPaper>
      <List
        component="nav"
        subheader={
          <ListSubheader>
            <FormattedMessage id="pages.dashboard.exchange.referral" />
          </ListSubheader>
        }
      >
        <ListItemButton component={RouterLink} to="/referral/cabinet">
          <ListItemIcon>
            <Share />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.cabinet.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/referral/leaderboard">
          <ListItemIcon>
            <Leaderboard />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.leaderboard.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/referral/report/search">
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.report.title" />
          </ListItemText>
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/referral/report/chart">
          <ListItemIcon>
            <Timeline />
          </ListItemIcon>
          <ListItemText>
            <FormattedMessage id="pages.referral.chart.title" />
          </ListItemText>
        </ListItemButton>
      </List>
    </StyledPaper>
  );
};
