import { FC, useEffect, useState } from "react";
import { Grid, MenuItem, Paper, Select, Typography } from "@mui/material";

import { Breadcrumbs, PageHeader } from "@gemunion/mui-page-layout";
import { useApiCall } from "@gemunion/react-hooks";
import type { ICmcQuote } from "@gemunion/types-coin-market-cap";

import { BaseCoins, TargetCoins } from "./enums";

export const CoinMarketCap: FC = () => {
  const [baseCoinId, setBaseCoinId] = useState(BaseCoins.ETH);
  const [targetCoinId, setTargetCoinId] = useState(TargetCoins.USD);
  const [result, setResult] = useState<ICmcQuote>({ price: 0 } as ICmcQuote);

  const { fn } = useApiCall(
    async api => {
      return api.fetchJson({
        url: "/coin-market-cap/rates",
        data: {
          baseCoinId,
          targetCoinId,
        },
      });
    },
    { success: false },
  );

  useEffect(() => {
    void fn().then((result: ICmcQuote) => {
      setResult(result);
    });
  }, [baseCoinId, targetCoinId]);

  return (
    <Grid>
      <Breadcrumbs path={["dashboard", "coin-market-cap"]} />

      <PageHeader message="pages.coin-market-cap.title" />

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
          <Typography variant="h4" component="span">
            {result?.price.toFixed(2)}
          </Typography>{" "}
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
