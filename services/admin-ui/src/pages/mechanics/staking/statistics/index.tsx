import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Statistics: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking", "staking.statistics"]} />

      <PageHeader message="pages.staking.statistics.title" />

      <Typography>Here be dragons</Typography>
    </Grid>
  );
};
