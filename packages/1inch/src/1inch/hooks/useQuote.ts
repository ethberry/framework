import { useEffect } from "react";

import type { IQuote, IToken } from "../provider";
import { useOneInch } from "../provider";

import { useAsyncStateInOrder } from "./useAsyncStateInOrder";
import { safeParseUnits } from "../helpers/safeParseUnits";

export const useQuote = (amountToSend: string, fromToken?: IToken, toToken?: IToken): IQuote | null => {
  const [state, setState, clear] = useAsyncStateInOrder<IQuote | null>(null);
  const api = useOneInch();

  let didUnmount = false;

  useEffect(() => {
    setState(null);
    clear();

    if (
      !fromToken ||
      !toToken ||
      fromToken?.address === toToken?.address ||
      ![fromToken, toToken, amountToSend].every(el => !!el)
    ) {
      return () => {};
    }

    void api
      .getQuote(fromToken, toToken, safeParseUnits(amountToSend, fromToken).toString())
      .then(quote => {
        if (!didUnmount) {
          setState(quote);
        }
      })
      .catch(e => {
        console.error(e);
        if (!didUnmount) {
          setState(null);
        }
      });
    return () => {
      didUnmount = true;
    };
  }, [fromToken, toToken, amountToSend]);

  return state;
};
