import { FC, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ProviderRpcError } from "@web3-react/types";

import { TConnectors, getConnectorName, getConnectorByName } from "../connectors";
import { STORE_CONNECTOR, useWallet } from "../provider";

interface IReconnectProps {
  activeConnector: TConnectors | null;
}

export const Reconnect: FC<IReconnectProps> = props => {
  const { activeConnector } = props;

  const { isActive, connector } = useWeb3React();
  const { network } = useWallet();

  const handleConnect = async () => {
    if (!isActive && activeConnector) {
      await getConnectorByName(activeConnector)
        ?.activate(network.chainId)
        .catch((error: ProviderRpcError) => {
          console.error("Reconnect error", error);
        });
    }
  };

  useEffect(() => {
    void handleConnect();
  }, []);

  useEffect(() => {
    if (isActive) {
      const newConnector = getConnectorName(connector);

      if (newConnector) {
        localStorage.setItem(STORE_CONNECTOR, JSON.stringify(newConnector));
      }
    }
  }, [isActive]);

  return null;
};
