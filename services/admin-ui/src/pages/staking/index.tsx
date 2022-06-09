import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Staking: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "staking"]} />

      <PageHeader message="pages.staking.title" />

      <Typography>Here be dragons!</Typography>
    </Grid>
  );
};
