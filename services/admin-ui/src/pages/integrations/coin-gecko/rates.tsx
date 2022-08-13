import { FC, useState } from "react";
import { Grid, MenuItem, Paper, Select, Typography } from "@mui/material";

import { useCoinGecko } from "@gemunion/provider-coingecko";

import { BaseCoins, TargetCoins } from "./enums";

export const Rates: FC = () => {
  const [targetCoinId, setTargetCoinId] = useState(TargetCoins.USD);

  const { getPriceByTickerName, baseCoinId, setBaseCoinId } = useCoinGecko();

  return (
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
          {getPriceByTickerName(targetCoinId)}
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
  );
};
