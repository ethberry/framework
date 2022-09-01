import { FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import { useWallet } from "@gemunion/provider-wallet";

export const LotteryWrapper: FC = () => {
  const { isActive } = useWeb3React();

  const { openConnectWalletDialog, closeConnectWalletDialog } = useWallet();

  useEffect(() => {
    if (!isActive) {
      void openConnectWalletDialog();
    } else {
      void closeConnectWalletDialog();
    }
  }, [isActive]);

  return isActive ? <Outlet /> : null;
};
