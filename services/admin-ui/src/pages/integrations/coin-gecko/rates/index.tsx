import { FC, useEffect, useState } from "react";
import { Grid, MenuItem, Paper, Select, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import { ICoinGeckoCoinTicker } from "@gemunion/types-coin-gecko";

import { BaseCoins, TargetCoins } from "./enums";

export const CoinGeckoRates: FC = () => {
  const [baseCoinId, setBaseCoinId] = useState(BaseCoins.ETHEREUM);
  const [targetCoinId, setTargetCoinId] = useState(TargetCoins.USD);
  const [result, setResult] = useState<ICoinGeckoCoinTicker>({ last: 0 } as ICoinGeckoCoinTicker);

  const { fn } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/coin-gecko/rates",
        data: {
          baseCoinId,
          targetCoinId,
          exchangeIds: ["binance", "kraken"],
        },
      });
    },
    { success: false },
  );

  useEffect(() => {
    void fn().then((result: ICoinGeckoCoinTicker) => {
      setResult(result);
    });
  }, [baseCoinId, targetCoinId]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "coin-gecko"]} />

      <PageHeader message="pages.coin-gecko.title" />

      <Paper sx={{ p: 2 }}>
        <Grid container direction="row" alignItems="center" justifyContent="center">
          <Typography variant="h4" component="span">
            1
          </Typography>
          <Select
            sx={{ mx: 1 }}
            value={baseCoinId}
            onChange={(e: any) => {
              setBaseCoinId(e.target.value);
            }}
          >
            {Object.values(BaseCoins).map((option, i) => (
              <MenuItem value={option} key={i}>
                {option}
              </MenuItem>
            ))}
          </Select>
          <Typography variant="h4" component="span" sx={{ mx: 1 }}>
            =
          </Typography>
`          <Typography variant="h4" component="span">
            {result.last.toFixed(2)}
          </Typography>{" "}`
          <Select
            sx={{ mx: 1 }}
            value={targetCoinId}
            onChange={(e: any) => {
              setTargetCoinId(e.target.value);
            }}
          >
            {Object.values(TargetCoins).map((option, i) => (
              <MenuItem value={option} key={i}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </Grid>
      </Paper>
    </Grid>
  );
};
