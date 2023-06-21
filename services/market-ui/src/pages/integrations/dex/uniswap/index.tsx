import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { UniswapWidget } from "@framework/uniswap-widget";

export const Uniswap: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "dex", "dex.uniswap"]} />

      <PageHeader message="pages.dex.uniswap.title" />

      <Grid item sx={{ position: "relative" }}>
        <UniswapWidget />
      </Grid>
    </Grid>
  );
};
