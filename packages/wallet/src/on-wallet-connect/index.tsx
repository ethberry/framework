import { FC, useEffect } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

interface IOnWalletConnectProps {
  callback: ((web3Context: Web3ContextType) => Promise<any>) | null;
  setCallback: (fn: ((web3Context: Web3ContextType) => Promise<any>) | null) => void;
  resolve: (value?: any) => void;
}

export const OnWalletConnect: FC<IOnWalletConnectProps> = props => {
  const { callback, setCallback, resolve } = props;

  const web3Context = useWeb3React();
  const { isActive } = web3Context;

  useEffect(() => {
    if (isActive && callback) {
      // eslint-disable-next-line promise/catch-or-return
      setTimeout(() => {
        void callback(web3Context).finally(() => {
          setCallback(null);
          resolve();
        });
      }, 500);
    }
  }, [web3Context.isActive, callback]);

  return null;
};
