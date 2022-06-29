import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Reward: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.reward"]} />

      <PageHeader message="pages.staking.reward.title" />

      <Typography>Here be dragons</Typography>
    </Grid>
  );
};
