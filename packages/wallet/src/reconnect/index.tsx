import { FC, useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ProviderRpcError } from "@web3-react/types";

import { useUser } from "@gemunion/provider-user";
import { TConnectors, useAppSelector } from "@gemunion/redux";

import { getConnectorName, getConnectorByName } from "../connectors";
import { particleAuth } from "../connectors/particle";
import { STORE_CONNECTOR } from "../provider";

export const Reconnect: FC = () => {
  const { isActive, chainId, connector } = useWeb3React();
  const { activeConnector, network } = useAppSelector(state => state.wallet);
  const user = useUser<any>();
  const userIsAuthenticated = user.isAuthenticated();

  const handleConnect = useCallback(async () => {
    if ((!isActive || network?.chainId !== chainId) && activeConnector && network) {
      if (activeConnector === TConnectors.PARTICLE) {
        await particleAuth?.connectEagerly();
      } else {
        await getConnectorByName(activeConnector)
          ?.activate(network.chainId)
          .catch((error: ProviderRpcError) => {
            console.error("Reconnect error", error);
          });
      }
    }
  }, [activeConnector, chainId, network]);

  useEffect(() => {
    if (userIsAuthenticated) {
      void handleConnect();
    }
  }, [chainId, network, userIsAuthenticated]);

  useEffect(() => {
    if (isActive) {
      const newConnector = getConnectorName(connector);

      if (newConnector) {
        localStorage.setItem(STORE_CONNECTOR, JSON.stringify(newConnector));
      }
    }
  }, [isActive, network]);

  return null;
};
