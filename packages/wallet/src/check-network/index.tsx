import { FC, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { useWallet } from "../provider";

export const CheckNetwork: FC = () => {
  const { isActive, chainId, connector } = useWeb3React();
  const { network, setActiveConnector } = useWallet();

  const handleDisconnect = () => {
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }
    setActiveConnector(null);
  };

  const checkChainId = async () => {
    try {
      await connector?.provider?.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${network.chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await connector?.provider?.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                ...network,
                chainId: `0x${network.chainId.toString(16)}`,
              },
            ],
          });
          await connector?.provider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${network.chainId.toString(16)}` }],
          });
        } catch (addError: any) {
          handleDisconnect();
          console.error(addError);
        }
      } else if (error.code === 4001) {
        handleDisconnect();
        console.error(error);
      }
    }
  };

  useEffect(() => {
    if (connector && isActive && chainId) {
      void checkChainId();
    }
  }, [connector, isActive, chainId]);

  return null;
};
