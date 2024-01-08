import { IHandlerOptionsParams } from "./interfaces";
import { useMetamaskWallet } from "./use-metamask-wallet";

export const useMetamaskValue = <T = any>(
  fn: (...args: Array<any>) => Promise<T>,
  options: IHandlerOptionsParams = {},
) => {
  const metaFn = useMetamaskWallet(fn, options);

  return (...args: Array<any>): Promise<T> => {
    return metaFn(...args);
  };
};
