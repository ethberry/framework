import { networks, STORE_CONNECTOR } from "./constants";
import { IWalletState, TConnectors } from "./interfaces";

const storedConnector = localStorage.getItem(STORE_CONNECTOR);

export const emptyWalletState: IWalletState = {
  isDialogOpen: false,
  activeConnector: storedConnector ? (JSON.parse(storedConnector) as TConnectors) : null,
  network: null,
  networks,
  wallets: [],
  activeWallets: [],
  resolve: null,
};
