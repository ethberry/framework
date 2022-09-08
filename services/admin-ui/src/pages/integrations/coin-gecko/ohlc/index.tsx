import { FC } from "react";
import { Grid, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

export const CoinGeckoOhlc: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "coin-gecko"]} />

      <PageHeader message="pages.coin-gecko.ohlc" />

      <Typography>Here be dragons</Typography>
    </Grid>
  );
};
