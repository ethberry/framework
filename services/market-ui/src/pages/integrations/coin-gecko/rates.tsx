import { FC, useState } from "react";
import { Grid, MenuItem, Typography } from "@mui/material";

import { useCoinGecko } from "@gemunion/provider-coingecko";

import { BaseCoins, TargetCoins } from "./enums";
import { StyledPaper, StyledSelect, StyledTypography } from "./styled";

export const Rates: FC = () => {
  const [targetCoinId, setTargetCoinId] = useState(TargetCoins.USD);

  const { getPriceByTickerName, baseCoinId, setBaseCoinId } = useCoinGecko();

  return (
    <StyledPaper>
      <Grid container direction="row" alignItems="center" justifyContent="center">
        <Typography variant="h4" component="span">
          1
        </Typography>
        <StyledSelect
          value={baseCoinId}
          onChange={(e: any) => {
            setBaseCoinId(e.target.value);
          }}
        >
          {Object.values(BaseCoins).map(option => (
            <MenuItem value={option} key={option}>
              {option}
            </MenuItem>
          ))}
        </StyledSelect>
        <StyledTypography variant="h4" component="span">
          =
        </StyledTypography>
        <Typography variant="h4" component="span">
          {getPriceByTickerName(targetCoinId)}
        </Typography>{" "}
        <StyledSelect
          value={targetCoinId}
          onChange={(e: any) => {
            setTargetCoinId(e.target.value);
          }}
        >
          {Object.values(TargetCoins).map(option => (
            <MenuItem value={option} key={option}>
              {option}
            </MenuItem>
          ))}
        </StyledSelect>
      </Grid>
    </StyledPaper>
  );
};
