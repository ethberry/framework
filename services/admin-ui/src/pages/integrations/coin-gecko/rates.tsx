import { FC } from "react";
import { Paper, Typography } from "@mui/material";
import { constants } from "ethers";
import { useCoinGecko } from "@gemunion/provider-coingecko";

export const Rates: FC = () => {
  const { coinPrice } = useCoinGecko();

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" sx={{ textAlign: "center" }}>
        {constants.EtherSymbol}1 = ${coinPrice}
      </Typography>
    </Paper>
  );
};
