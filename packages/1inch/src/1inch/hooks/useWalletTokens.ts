import { useEffect, useMemo, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";

import { GovernanceTokenAddress, IToken } from "../provider";

import { useAllTokens } from "./useAllTokens";

export const useWalletTokens = (): Array<IToken> => {
  const allTokens = useAllTokens();
  const web3 = useWeb3React();
  const [state, setState] = useState<ethers.providers.Log[]>([]);

  useEffect(() => {
    if (!web3.account || !web3.isActive) {
      return;
    }

    web3
      .provider!.getLogs({
        address: undefined,
        fromBlock: 0,
        toBlock: "latest",
        topics: [null, null, web3.account.replace("0x", "0x000000000000000000000000")],
      })
      .then(setState)
      .catch(console.error);
  }, [web3.account, web3.isActive]);

  return useMemo(() => {
    if (!web3.account) {
      return [];
    }
    const logAddresses = state.map(l => l.address.toLowerCase());

    return allTokens.filter(
      token =>
        token.address === GovernanceTokenAddress ||
        state.find(() => logAddresses.includes(token.address.toLowerCase())),
    );
  }, [allTokens, state, web3.account]);
};
