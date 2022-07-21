import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import type { Connector } from "@web3-react/types";

import { metaMask } from "./meta-mask";
import { walletConnect } from "./wallet-connect";
import { TConnectors } from "./types";

export const Connectors: Record<TConnectors, any> = {
  [TConnectors.METAMASK]: metaMask,
  [TConnectors.WALLETCONNECT]: walletConnect,
};

export const getConnectorName = (connector: Connector) => {
  switch (true) {
    case connector instanceof MetaMask:
      return TConnectors.METAMASK;
    case connector instanceof WalletConnect:
      return TConnectors.WALLETCONNECT;
    default:
      return null;
  }
};

export type ConnectorsTypes = MetaMask | WalletConnect;

export const getConnectorByName = (name: TConnectors): ConnectorsTypes | null => {
  switch (name) {
    case TConnectors.METAMASK:
      return metaMask;
    case TConnectors.WALLETCONNECT:
      return walletConnect;
    default:
      return null;
  }
};

export { TConnectors };
