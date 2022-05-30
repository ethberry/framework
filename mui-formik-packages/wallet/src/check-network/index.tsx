import { FC, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { useWallet } from "../provider";

export const CheckNetwork: FC = () => {
  const { library, active, chainId, deactivate } = useWeb3React();
  const { network, setActiveConnector } = useWallet();

  const handleDisconnect = () => {
    deactivate();
    setActiveConnector(null);
  };

  const checkChainId = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [network],
          });
          await library.provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: network.chainId }],
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
    if (library && active && chainId) {
      void checkChainId();
    }
  }, [library, active, chainId]);

  return null;
};
