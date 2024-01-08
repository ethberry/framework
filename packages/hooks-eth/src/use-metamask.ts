import { IHandlerOptionsParams } from "./interfaces";
import { useMetamaskWallet } from "./use-metamask-wallet";

export const useMetamask = (fn: (...args: Array<any>) => Promise<any>, options: IHandlerOptionsParams = {}) => {
  const metaFn = useMetamaskWallet(fn, options);

  return (...args: Array<any>) => {
    return metaFn(...args) as Promise<void>;
  };
};
