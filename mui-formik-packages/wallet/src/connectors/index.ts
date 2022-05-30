// import { authereumConnector, AuthereumConnector } from "./authereum";
// import { fortmaticConnector, FortmaticConnector } from "./formatic";
import { injectedConnector, InjectedConnector } from "./meta-mask";
// import { ledgerConnector } from "./ledger";
// import { portisConnector, PortisConnector } from "./portis";
// import { torusConnector, TorusConnector } from "./torus";
// import { trezorConnector } from "./trezor";
import { walletConnectConnector, WalletConnectConnector } from "./wallet-connect";
import { TConnectors } from "./types";

export const Connectors: Record<TConnectors, any> = {
  // [TConnectors.AUTHEREUM]: authereumConnector,
  // [TConnectors.FORMATIC]: fortmaticConnector,
  [TConnectors.INJECTED]: injectedConnector,
  // [TConnectors.LEDGER]: ledgerConnector,
  // [TConnectors.PORTIS]: portisConnector,
  // [TConnectors.TORUS]: torusConnector,
  // [TConnectors.TREZOR]: trezorConnector,
  [TConnectors.WALLETCONNECT]: walletConnectConnector,
};

export const getConnectorName = (connector: any) => {
  switch (true) {
    // case connector instanceof AuthereumConnector:
    //   return TConnectors.AUTHEREUM;
    // case connector instanceof FortmaticConnector:
    //   return TConnectors.FORMATIC;
    case connector instanceof InjectedConnector:
      return TConnectors.INJECTED;
    // case connector instanceof PortisConnector:
    //   return TConnectors.PORTIS;
    // case connector instanceof TorusConnector:
    //   return TConnectors.TORUS;
    case connector instanceof WalletConnectConnector:
      return TConnectors.WALLETCONNECT;
    default:
      return null;
  }
};

export const getConnectorByName = (name: TConnectors) => {
  switch (name) {
    // case connector instanceof AuthereumConnector:
    //   return TConnectors.AUTHEREUM;
    // case connector instanceof FortmaticConnector:
    //   return TConnectors.FORMATIC;
    case TConnectors.INJECTED:
      return injectedConnector;
    // case connector instanceof PortisConnector:
    //   return TConnectors.PORTIS;
    // case connector instanceof TorusConnector:
    //   return TConnectors.TORUS;
    case TConnectors.WALLETCONNECT:
      return walletConnectConnector;
    default:
      return null;
  }
};

export { TConnectors };
