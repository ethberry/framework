import { initializeConnector, Web3ReactHooks } from "@web3-react/core";
import { Web3ReactStore } from "@web3-react/types";
import { WalletConnect } from "@web3-react/walletconnect";

/* javascript-obfuscator:disable */
const jsonRpcUrl = process.env.JSON_RPC_ADDR;
const chainId = process.env.CHAIN_ID;
/* javascript-obfuscator:enable */

export const [walletConnect, hooks, store]: [WalletConnect, Web3ReactHooks, Web3ReactStore] =
  initializeConnector<WalletConnect>(
    (actions): WalletConnect =>
      new WalletConnect({
        actions,
        options: {
          rpc: {
            [chainId]: jsonRpcUrl,
          },
          qrcode: true,
        },
      }),
  );
