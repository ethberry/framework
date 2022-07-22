import { useApi } from "@gemunion/provider-api";
import { Web3ContextType } from "@web3-react/core";

export const useServerSignature = (fn: (...args: Array<any>) => Promise<void>): ((data: any, web3Context: Web3ContextType, thenHandler?: any, catchHandler?: any) => Promise<any>) => {
  const api = useApi();

  return async (...args: Array<any>) => {
    const data = args[0];
    const web3Context = args[1];
    const thenHandler = args[2];
    const catchHandler = args[3];

    return api
      .fetchJson(data)
      .then(sign => fn({
        ...data?.data,
        web3Context,
        thenHandler,
        catchHandler,
        sign,
      }))
      .catch(e => {
        throw e;
      });
  };
};
