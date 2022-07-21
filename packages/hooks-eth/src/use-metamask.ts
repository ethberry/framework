import { useWeb3React, Web3ContextType } from "@web3-react/core";

import { useWallet } from "@gemunion/provider-wallet";

import { useMetamaskValue } from "./use-metamask-value";

export const useMetamask = (fn: (...args: Array<any>) => Promise<any>) => {
  const web3ContextGlobal = useWeb3React();
  const { isActive } = web3ContextGlobal;
  const { onWalletConnect } = useWallet();

  const metaFn = useMetamaskValue(fn);

  return async (...args: Array<any>) => {
    const params = args.length > 0 ? args[0] : {};
    const { thenHandler = () => {}, catchHandler = () => {}, web3Context = null } = params;

    if (!isActive && !web3Context?.isActive) {
      return onWalletConnect(() => (web3Context: Web3ContextType) => {
        return metaFn({ ...params, web3Context })
          .then((result: any) => {
            thenHandler?.(result);
          })
          .catch((e: any) => {
            catchHandler?.(e);
          });
      })();
    }

    return metaFn({ ...params, web3Context: web3Context || web3ContextGlobal });
  };
};
