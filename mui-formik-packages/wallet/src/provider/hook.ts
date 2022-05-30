import { useContext } from "react";

import { WalletContext } from "./context";

export const useWallet = () => {
  return useContext(WalletContext);
};
