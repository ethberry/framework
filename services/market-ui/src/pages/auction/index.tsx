import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const Auctions: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "auctions"]} />

      <PageHeader message="pages.auctions.title" />

      <Typography>Here be dragons!</Typography>
    </Grid>
  );
};
