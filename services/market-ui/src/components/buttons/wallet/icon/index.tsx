import { FC } from "react";
import { AccountBalanceWallet } from "@mui/icons-material";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { useWeb3React } from "@web3-react/core";

import { MetaMaskIcon, WalletConnectIcon } from "@gemunion/provider-wallet";

export const WalletIcon: FC = () => {
  const { isActive, connector } = useWeb3React();

  switch (true) {
    case isActive && connector instanceof MetaMask:
      return <MetaMaskIcon viewBox="0 0 60 60" sx={{ fontSize: 24 }} />;
    case isActive && connector instanceof WalletConnect:
      return <WalletConnectIcon viewBox="0 0 60 60" sx={{ fontSize: 24 }} />;
    default:
      return <AccountBalanceWallet />;
  }
};
