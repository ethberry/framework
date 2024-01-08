import { FC, useCallback, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { useAppDispatch, useAppSelector, walletActions } from "@gemunion/redux";

export const CheckNetwork: FC = () => {
  const { isActive, chainId, connector } = useWeb3React();
  const { network } = useAppSelector(state => state.wallet);
  const { setActiveConnector } = walletActions;
  const dispatch = useAppDispatch();

  const handleDisconnect = () => {
    if (connector?.deactivate) {
      void connector.deactivate();
    } else {
      void connector.resetState();
    }
    dispatch(setActiveConnector(null));
  };

  const checkChainId = useCallback(async () => {
    if (!network) {
      return;
    }

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
  }, [network]);

  useEffect(() => {
    if (connector && isActive && chainId) {
      void checkChainId();
    }
  }, [connector, isActive, chainId, network]);

  return null;
};
