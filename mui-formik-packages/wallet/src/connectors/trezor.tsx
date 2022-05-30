import { TrezorConnector } from "@web3-react/trezor-connector";

export const trezorConnector = new TrezorConnector({
  chainId: 1,
  url: process.env.JSON_RPC_ADDR as string,
  pollingInterval: 12000,
  manifestEmail: "dummy@abc.xyz",
  manifestAppUrl: "http://localhost:1234",
});
