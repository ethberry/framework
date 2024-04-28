import { FC } from "react";
import { AccountBalanceWallet } from "@mui/icons-material";
import { MetaMask } from "@web3-react/metamask";
import { WalletConnect } from "@web3-react/walletconnect";
import { useWeb3React } from "@web3-react/core";

import { MetaMaskIcon, ParticleAuth, ParticleIcon, WalletConnectIcon, ZealIcon } from "@gemunion/provider-wallet";

export const WalletIcon: FC = () => {
  const { isActive, connector } = useWeb3React();

  switch (true) {
    case isActive && connector instanceof MetaMask:
      if (window.zeal?._chainId && window.zeal?._selectedAddress) {
        return <ZealIcon sx={{ width: 19, height: "auto" }} />;
      }
      return <MetaMaskIcon viewBox="0 0 60 60" sx={{ fontSize: 24 }} />;
    case isActive && connector instanceof ParticleAuth:
      return <ParticleIcon />;
    case isActive && connector instanceof WalletConnect:
      return <WalletConnectIcon viewBox="0 0 60 60" sx={{ fontSize: 24 }} />;
    default:
      return <AccountBalanceWallet />;
  }
};
