import { TrezorConnector } from "@web3-react/trezor-connector";

/* javascript-obfuscator:disable */
const jsonRpcUrl = process.env.JSON_RPC_ADDR;
/* javascript-obfuscator:enable */

export const trezorConnector = new TrezorConnector({
  chainId: 1,
  url: jsonRpcUrl,
  pollingInterval: 12000,
  manifestEmail: "dummy@abc.xyz",
  manifestAppUrl: "http://localhost:1234",
});
