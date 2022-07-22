import { FC, useEffect } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";

interface IOnWalletConnectProps {
  resolveContext: ((value: Web3ContextType) => void) | null;
  resetConnect: () => void;
}

export const OnWalletConnect: FC<IOnWalletConnectProps> = props => {
  const { resolveContext, resetConnect } = props;

  const web3Context = useWeb3React();
  const { isActive } = web3Context;

  useEffect(() => {
    if (isActive && resolveContext) {
      resolveContext(web3Context);
      resetConnect();
    }
  }, [web3Context.isActive, resolveContext]);

  return null;
};
