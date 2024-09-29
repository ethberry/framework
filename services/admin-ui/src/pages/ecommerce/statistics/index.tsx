import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@ethberry/mui-page-layout";

export const Statistics: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "ecommerce", "statistics"]} />

      <PageHeader message="pages.statistics.title" />
    </Grid>
  );
};
