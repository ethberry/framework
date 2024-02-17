import { FC } from "react";
import { List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from "@mui/material";
import { BarChart, Groups } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import { NodeEnv } from "@framework/types";

import { StyledPaper } from "../styled";

export const ReferralSection: FC = () => {
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
            <FormattedMessage id="pages.dashboard.mechanics.referral" />
          </ListSubheader>
        }
      >
        {/* <ListItemButton component={RouterLink} to="/referral/leaderboard"> */}
        {/*  <ListItemIcon> */}
        {/*    <Leaderboard /> */}
        {/*  </ListItemIcon> */}
        {/*  <ListItemText> */}
        {/*    <FormattedMessage id="pages.referral.leaderboard.title" /> */}
        {/*  </ListItemText> */}
        {/* </ListItemButton> */}
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
        {/* <ListItemButton component={RouterLink} to="/referral/report/chart"> */}
        {/*  <ListItemIcon> */}
        {/*    <Timeline /> */}
        {/*  </ListItemIcon> */}
        {/*  <ListItemText> */}
        {/*    <FormattedMessage id="pages.referral.chart.title" /> */}
        {/*  </ListItemText> */}
        {/* </ListItemButton> */}
      </List>
    </StyledPaper>
  );
};
