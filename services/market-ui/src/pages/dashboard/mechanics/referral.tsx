import { FC } from "react";
import { List, ListSubheader } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { StyledPaper } from "../styled";

export const ReferralSection: FC = () => {
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
        {/* <ListItemButton component={RouterLink} to="/referral/cabinet"> */}
        {/*  <ListItemIcon> */}
        {/*    <Casino /> */}
        {/*  </ListItemIcon> */}
        {/*  <ListItemText> */}
        {/*    <FormattedMessage id="pages.referral.title" /> */}
        {/*  </ListItemText> */}
        {/* </ListItemButton> */}
        {/* <ListItemButton component={RouterLink} to="/referral/leaderboard"> */}
        {/*  <ListItemIcon> */}
        {/*    <ConfirmationNumber /> */}
        {/*  </ListItemIcon> */}
        {/*  <ListItemText> */}
        {/*    <FormattedMessage id="pages.referral.leaderboard.title" /> */}
        {/*  </ListItemText> */}
        {/* </ListItemButton> */}
      </List>
    </StyledPaper>
  );
};
