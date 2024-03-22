import { FC, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";

export interface IRefresherProps {
  onRefreshPage: () => Promise<void>;
}

export const FormRefresher: FC<IRefresherProps> = props => {
  const { onRefreshPage } = props;

  const { profile } = useUser<IUser>();
  const { account } = useWeb3React();

  useEffect(() => {
    void onRefreshPage();
  }, [profile?.chainId, account]);

  return null;
};
