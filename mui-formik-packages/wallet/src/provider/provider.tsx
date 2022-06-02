import { FC, useState } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { providers } from "ethers";

import { usePopup } from "@gemunion/provider-popup";
import { useLicense } from "@gemunion/provider-license";

import { TConnectors } from "../connectors";
import { INetwork } from "../interfaces";
import { WalletContext } from "./context";
import { networks, STORE_CONNECTOR, WALLET_CONNECT_POPUP_TYPE } from "./constants";
import { Reconnect } from "../reconnect";
import { CheckNetwork } from "../check-network";

interface IWalletProviderProps {
  targetNetwork?: INetwork;
}

/* javascript-obfuscator:disable */
const targetNetworkId = ~~process.env.CHAIN_ID;
/* javascript-obfuscator:enable */

export const WalletProvider: FC<IWalletProviderProps> = props => {
  const { targetNetwork = networks[targetNetworkId], children } = props;

  const { openPopup, closePopup } = usePopup();
  const license = useLicense();

  const [network, setNetwork] = useState<INetwork>(targetNetwork);
  const [activeConnector, setActiveConnector] = useState<TConnectors | null>(
    localStorage.getItem(STORE_CONNECTOR) as TConnectors | null,
  );

  const getLibrary = (provider: any) => {
    return new providers.Web3Provider(provider);
  };

  const openConnectWalletDialog = (): void => {
    openPopup(WALLET_CONNECT_POPUP_TYPE);
  };

  const closeConnectWalletDialog = (): void => {
    closePopup();
  };

  const setActiveConnectorHandle = (value: TConnectors | null) => {
    setActiveConnector(value);
    localStorage.setItem(STORE_CONNECTOR, JSON.stringify(value));
  };

  if (!license.isValid()) {
    return null;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <WalletContext.Provider
        value={{
          activeConnector,
          setActiveConnector: setActiveConnectorHandle,
          openConnectWalletDialog,
          closeConnectWalletDialog,
          network,
          setNetwork,
        }}
      >
        <>
          {children}
          <Reconnect activeConnector={activeConnector} />
          <CheckNetwork />
        </>
      </WalletContext.Provider>
    </Web3ReactProvider>
  );
};
