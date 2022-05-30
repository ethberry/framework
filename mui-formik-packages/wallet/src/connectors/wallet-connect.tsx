import { WalletConnectConnector } from "@web3-react/walletconnect-connector";

export const walletConnectConnector = new WalletConnectConnector({
  // supportedChainIds: Object.values(networkToChainId),
  rpc: {
    [process.env.CHAIN_ID]: process.env.JSON_RPC_ADDR,
  },
  qrcode: true,
});

export { WalletConnectConnector };
