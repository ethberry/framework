import { PortisConnector } from "@web3-react/portis-connector";

export const portisConnector = new PortisConnector({
  dAppId: "123",
  networks: [
    {
      chainId: "1",
    },
  ],
});

export { PortisConnector };
