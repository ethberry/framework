import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { ITabPanelProps, ProfileTabs } from "../tabs";

export const ProfileSubscriptions: FC<ITabPanelProps> = props => {
  const { value } = props;

  if (value !== ProfileTabs.subscriptions) {
    return null;
  }

  return (
    <Grid>
      <PageHeader message="pages.profile.tabs.subscriptions" />
      <Typography>You are not subscribed...</Typography>
    </Grid>
  );
};
