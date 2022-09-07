import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Dragons: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "dragons"]} />

      <PageHeader message="pages.dragons.title" />

      <Typography>Here be dragons</Typography>
    </Grid>
  );
};
