import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { PageHeader } from "@gemunion/mui-page-layout";

import { ITabPanelProps } from "../interfaces";

export const ProfileSubscriptions: FC<ITabPanelProps> = props => {
  const { open } = props;

  if (!open) {
    return null;
  }

  return (
    <Grid>
      <PageHeader message="pages.profile.tabs.subscriptions" />
      <Typography>You are not subscribed...</Typography>
    </Grid>
  );
};
