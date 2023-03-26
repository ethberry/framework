import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Statistics: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "statistics"]} />

      <PageHeader message="pages.statistics.title" />
    </Grid>
  );
};
