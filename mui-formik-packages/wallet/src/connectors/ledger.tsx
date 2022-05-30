import { LedgerConnector } from "@web3-react/ledger-connector";

export const ledgerConnector = new LedgerConnector({
  chainId: 1,
  url: process.env.JSON_RPC_ADDR as string,
  pollingInterval: 12000,
});
