import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

/* javascript-obfuscator:disable */
const jsonRpcUrl = process.env.JSON_RPC_ADDR;
const chainId = process.env.CHAIN_ID;
/* javascript-obfuscator:enable */

export const walletConnectConnector = new WalletConnectConnector({
  // supportedChainIds: Object.values(networkToChainId),
  rpc: {
    [chainId]: jsonRpcUrl,
  },
  qrcode: true,
});

export { WalletConnectConnector };
