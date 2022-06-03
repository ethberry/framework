import { LedgerConnector } from "@web3-react/ledger-connector";

/* javascript-obfuscator:disable */
const jsonRpcUrl = process.env.JSON_RPC_ADDR;
/* javascript-obfuscator:enable */

export const ledgerConnector = new LedgerConnector({
  chainId: 1,
  url: jsonRpcUrl,
  pollingInterval: 12000,
});
