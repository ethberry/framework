import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";

import { OhlcChart } from "./chart";

export const CoinGeckoOhlc: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "coin-gecko"]} />

      <PageHeader message="pages.coin-gecko.ohlc" />

      <OhlcChart />
    </Grid>
  );
};
