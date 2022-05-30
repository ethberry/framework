import { FC } from "react";
import { AccountBalanceWallet } from "@mui/icons-material";
import { InjectedConnector } from "@web3-react/injected-connector";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
// import { TrezorConnector } from "@web3-react/trezor-connector";
import { useWeb3React } from "@web3-react/core";

import {
  MetaMaskIcon,
  WalletConnectIcon,
  // TrezorIcon
} from "../dialog/wallet-icons";

export const WalletIcon: FC = () => {
  const { connector } = useWeb3React();

  switch (true) {
    case connector instanceof InjectedConnector:
      return <MetaMaskIcon viewBox="0 0 60 60" sx={{ fontSize: 24 }} />;
    case connector instanceof WalletConnectConnector:
      return <WalletConnectIcon viewBox="0 0 60 60" sx={{ fontSize: 24 }} />;
    // case connector instanceof TrezorConnector:
    //   return <Trezor viewBox="0 0 60 60"  sx={{ fontSize: 24 }} />;
    default:
      return <AccountBalanceWallet />;
  }
};
