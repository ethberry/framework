import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Pyramid: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "pyramid"]} />

      <PageHeader message="pages.pyramid.title" />

      <Typography>Here be dragons</Typography>
    </Grid>
  );
};
