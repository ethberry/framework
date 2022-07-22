import { useWeb3React } from "@web3-react/core";

import { useWallet } from "@gemunion/provider-wallet";

import { useMetamaskValue } from "./use-metamask-value";

export const useMetamask = (fn: (...args: Array<any>) => Promise<any>) => {
  const web3ContextGlobal = useWeb3React();
  const { isActive } = web3ContextGlobal;
  const { openConnectWalletDialog } = useWallet();

  const metaFn = useMetamaskValue(fn);

  return async (...args: Array<any>) => {
    const params = args[0];

    let context = web3ContextGlobal;

    if (!isActive) {
      context = await openConnectWalletDialog();
    }

    return metaFn({ ...params }, context);
  };
};
