import { createContext } from "react";
import { Web3ContextType } from "@web3-react/core";

export interface IWalletContext {
  openConnectWalletDialog: () => Promise<Web3ContextType>;
  connectCallback: (fn: () => Promise<any>) => Promise<void>;
  closeConnectWalletDialog: () => void;
}

export const WalletContext = createContext<IWalletContext>(undefined!);
