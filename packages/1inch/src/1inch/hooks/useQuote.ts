import { useEffect, useState } from "react";

import type { IQuote, IToken } from "../provider";
import { useOneInch } from "../provider";
import { safeParseUnits } from "../helpers/safeParseUnits";

export interface IUseQuoteReturn {
  quote: IQuote | null;
  isLoading?: boolean;
}

export const useQuote = (amountToSend: string, fromToken?: IToken, toToken?: IToken): IUseQuoteReturn => {
  const { getQuote, isQuoteLoading } = useOneInch();
  const [quote, setQuote] = useState<IQuote | null>(null);

  let didUnmount = false;

  const handleQuote = async (from: IToken, to: IToken, amount: string) => {
    const quoteResponse = await getQuote(from, to, safeParseUnits(amount, from).toString());
    if (quoteResponse && !didUnmount) {
      setQuote(quoteResponse);
    } else {
      setQuote(null);
    }
  };

  useEffect(() => {
    setQuote(null);

    if (
      !fromToken ||
      !toToken ||
      fromToken?.address === toToken?.address ||
      ![fromToken, toToken, amountToSend].every(el => !!el)
    ) {
      return;
    }

    void handleQuote(fromToken, toToken, amountToSend);

    return () => {
      didUnmount = true;
    };
  }, [fromToken, toToken, amountToSend]);

  return {
    quote,
    isLoading: isQuoteLoading,
  };
};
