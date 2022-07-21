import { useApi } from "@gemunion/provider-api";

import { useMetamask } from "./use-metamask";

export const useServerSignature = (
  fn: (thenHandler?: any, catchHandler?: any, ...args: Array<any>) => Promise<void>,
): ((data: any, thenHandler?: any, catchHandler?: any) => Promise<any>) => {
  const metaFn = useMetamask(fn);
  const api = useApi();

  return async (data: any, thenHandler?: any, catchHandler?: any) => {
    return api
      .fetchJson(data)
      .then(sign => metaFn({
        ...data?.data,
        web3Context: data?.web3Context,
        thenHandler,
        catchHandler,
        sign,
      }))
      .catch(e => {
        throw e;
      });
  };
};
