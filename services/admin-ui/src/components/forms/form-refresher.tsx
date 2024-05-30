import { FC, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

export interface IFormRefresherProps {
  onRefreshPage: () => Promise<void>;
}

export const FormRefresher: FC<IFormRefresherProps> = props => {
  const { onRefreshPage } = props;

  const { account, chainId } = useWeb3React();

  useEffect(() => {
    void onRefreshPage();
  }, [account, chainId]);

  return null;
};
