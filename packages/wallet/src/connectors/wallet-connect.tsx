import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { Web3ReactStore } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";

import { rpcUrls } from "../provider";

export const [walletConnect, hooks, store]: [WalletConnect, Web3ReactHooks, Web3ReactStore] =
  initializeConnector<WalletConnect>(
    (actions): WalletConnect =>
      new WalletConnect({
        actions,
        options: {
          rpc: rpcUrls,
          qrcode: true,
        },
      }),
  );
