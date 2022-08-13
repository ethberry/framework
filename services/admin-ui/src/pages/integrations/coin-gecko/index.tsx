import { FC } from "react";
import { Grid } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { CoinGeckoProvider } from "@gemunion/provider-coingecko";
import { Rates } from "./rates";
import { BaseCoins } from "./enums";

export const CoinGecko: FC = () => {
  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "coin-gecko"]} />

      <PageHeader message="pages.coin-gecko.title" />

      <CoinGeckoProvider defaultMarkets={["binance", "kraken"]} defaultCurrency={BaseCoins.ETHEREUM}>
        <Rates />
      </CoinGeckoProvider>
    </Grid>
  );
};
