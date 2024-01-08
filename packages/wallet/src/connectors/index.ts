import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import type { Connector } from "@web3-react/types";

import { TConnectors } from "@gemunion/redux";

import { metaMask } from "./meta-mask";
import { walletConnect } from "./wallet-connect";
import { particleAuth, ParticleAuth } from "./particle";

export { ParticleAuth } from "./particle";

export const getConnectorName = (connector: Connector) => {
  switch (true) {
    case connector instanceof MetaMask:
      return TConnectors.METAMASK;
    case connector instanceof ParticleAuth:
      return TConnectors.PARTICLE;
    case connector instanceof WalletConnect:
      return TConnectors.WALLETCONNECT;
    default:
      return null;
  }
};

export type ConnectorsTypes = MetaMask | ParticleAuth | WalletConnect;

export const getConnectorByName = (name: TConnectors): ConnectorsTypes | null => {
  switch (name) {
    case TConnectors.METAMASK:
      return metaMask;
    case TConnectors.PARTICLE:
      return particleAuth;
    case TConnectors.WALLETCONNECT:
      return walletConnect;
    default:
      return null;
  }
};
