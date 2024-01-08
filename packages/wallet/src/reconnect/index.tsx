import { FC, useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { ProviderRpcError } from "@web3-react/types";

import { useAppSelector } from "@gemunion/redux";

import { getConnectorName, getConnectorByName } from "../connectors";
import { STORE_CONNECTOR } from "../provider";

export const Reconnect: FC = () => {
  const { isActive, chainId, connector } = useWeb3React();
  const { activeConnector, network } = useAppSelector(state => state.wallet);

  const handleConnect = useCallback(async () => {
    if ((!isActive || network?.chainId !== chainId) && activeConnector && network) {
      await getConnectorByName(activeConnector)
        ?.activate(network.chainId)
        .catch((error: ProviderRpcError) => {
          console.error("Reconnect error", error);
        });
    }
  }, [chainId, network]);

  useEffect(() => {
    void handleConnect();
  }, [chainId, network]);

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
