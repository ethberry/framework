import { FC, useCallback, useEffect, useState } from "react";
import { Web3ReactProvider, Web3ReactHooks, Web3ContextType } from "@web3-react/core";

import { usePopup } from "@gemunion/provider-popup";
import { useLicense } from "@gemunion/provider-license";

import { ConnectorsTypes, TConnectors } from "../connectors";
import { metaMask, hooks as metaMaskHooks } from "../connectors/meta-mask";
import { walletConnect, hooks as walletConnectHooks } from "../connectors/wallet-connect";
import { INetwork } from "../interfaces";
import { WalletContext } from "./context";
import { getNetworkForWeb3Provider, networks, STORE_CONNECTOR, WALLET_CONNECT_POPUP_TYPE } from "./constants";
import { Reconnect } from "../reconnect";
import { CheckNetwork } from "../check-network";
import { OnWalletConnect } from "../on-wallet-connect";

interface IWalletProviderProps {
  targetNetwork?: INetwork;
}

const connectors: [ConnectorsTypes, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [walletConnect, walletConnectHooks],
];

/* javascript-obfuscator:disable */
const targetNetworkId = ~~process.env.CHAIN_ID;
/* javascript-obfuscator:enable */

export const WalletProvider: FC<IWalletProviderProps> = props => {
  const { targetNetwork = networks[targetNetworkId], children } = props;

  const { openPopup, closePopup } = usePopup();
  const license = useLicense();

  const [network, setNetwork] = useState<INetwork>(targetNetwork);

  const storedConnector = localStorage.getItem(STORE_CONNECTOR);
  const [activeConnector, setActiveConnector] = useState<TConnectors | null>(
    storedConnector ? (JSON.parse(storedConnector) as TConnectors) : null,
  );

  const [callback, setCallback] = useState<((web3Context: Web3ContextType) => Promise<any>) | null>(null);

  let resolve: (value?: any) => void = () => {};

  const openConnectWalletDialog = (): (() => Promise<any>) => {
    openPopup(WALLET_CONNECT_POPUP_TYPE);

    return () => {
      return new Promise(_resolve => {
        resolve = _resolve;
      });
    };
  };

  const onWalletConnect = useCallback((fn: () => (web3Context: Web3ContextType) => Promise<any>): (() => Promise<any>) => {
    setCallback(fn);
    if (!activeConnector) {
      openConnectWalletDialog();
    }

    return () => {
      return new Promise(_resolve => {
        resolve = _resolve;
      });
    };
  }, [activeConnector]);

  const closeConnectWalletDialog = (): void => {
    closePopup();
    setCallback(null);
  };

  const setActiveConnectorHandle = (value: TConnectors | null) => {
    setActiveConnector(value);
    localStorage.setItem(STORE_CONNECTOR, JSON.stringify(value));
  };

  useEffect(() => {
    if (activeConnector) {
      resolve();
    }
  }, [activeConnector]);

  if (!license.isValid()) {
    return null;
  }

  return (
    <Web3ReactProvider connectors={connectors} network={getNetworkForWeb3Provider(network.chainId)}>
      <WalletContext.Provider
        value={{
          activeConnector,
          setActiveConnector: setActiveConnectorHandle,
          openConnectWalletDialog,
          onWalletConnect,
          closeConnectWalletDialog,
          network,
          setNetwork,
        }}
      >
        <>
          {children}
          <Reconnect activeConnector={activeConnector} />
          <CheckNetwork />
          <OnWalletConnect callback={callback} setCallback={setCallback} resolve={resolve} />
        </>
      </WalletContext.Provider>
    </Web3ReactProvider>
  );
};
