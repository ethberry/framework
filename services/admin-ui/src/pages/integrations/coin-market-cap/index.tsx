import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { Rates } from "./rates";

export const CoinMarketCap: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "coin-market-cap"]} />

      <PageHeader message="pages.coin-market-cap.title" />

      <Rates />
    </Grid>
  );
};
