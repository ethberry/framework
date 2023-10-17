import { FC, useMemo } from "react";
import { Typography } from "@mui/material";

import type { IToken } from "../provider";

import { abbreviateNumber } from "../helpers/abbreviateNumber";
import { useCoinPriceUSD } from "../hooks/useCoinPriceUSD";

export interface ICoinPriceUSDProps {
  token: IToken;
  tokenQuantity: string;
}

export const CoinPriceUSD: FC<ICoinPriceUSDProps> = props => {
  let price = useCoinPriceUSD(props);
  price = useMemo(() => (price ? abbreviateNumber(price) : ""), [price]);
  return <Typography>{price ? `≈$${price}` : "…"}</Typography>;
};
