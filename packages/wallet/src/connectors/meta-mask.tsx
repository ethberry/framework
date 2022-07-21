import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";
import type { Web3ReactStore } from "@web3-react/types";

export const [metaMask, hooks, store]: [MetaMask, Web3ReactHooks, Web3ReactStore] = initializeConnector<MetaMask>(
  (actions): MetaMask => new MetaMask({ actions }),
);
