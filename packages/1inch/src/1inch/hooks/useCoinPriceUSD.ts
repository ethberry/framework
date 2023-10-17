import { useMemo } from "react";
import { BigNumber } from "ethers";
import { formatUnits } from "ethers/lib/utils";

import { stableCoinSymbol } from "../provider";
import type { IToken } from "../provider";

import { useAllTokens } from "./useAllTokens";
import { useQuote } from "./useQuote";

export interface IOptions {
  token: IToken;
  tokenQuantity: string;
}

export const useCoinPriceUSD = (options: IOptions): string => {
  const { token, tokenQuantity } = options;

  const allTokens = useAllTokens();
  const quote = useQuote(
    tokenQuantity,
    token,
    useMemo(() => allTokens.find(token => token.symbol === stableCoinSymbol), [allTokens]),
  );

  return useMemo(() => {
    if (!options.tokenQuantity || !options.token) {
      return "";
    }
    if (stableCoinSymbol === token?.symbol) {
      return (+tokenQuantity).toFixed(2);
    }
    if (!quote) {
      return "";
    }
    return (+formatUnits(BigNumber.from(quote.toTokenAmount), BigNumber.from(quote.toToken.decimals))).toFixed(2);
  }, [quote, token, tokenQuantity]);
};
