import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { OneInch as OneInchSwap } from "@gemunion/1inch";

export const OneInch: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "dex", "dex.1inch"]} />

      <PageHeader message="pages.dex.1inch.title" />

      <Grid item sx={{ position: "relative" }}>
        <OneInchSwap />
      </Grid>
    </Grid>
  );
};
