import { FC, useEffect } from "react";

import { useUser } from "@gemunion/provider-user";
import type { IUser } from "@framework/types";

export interface IRefresherProps {
  onRefreshPage: () => Promise<void>;
}

export const FormRefresher: FC<IRefresherProps> = props => {
  const { profile } = useUser<IUser>();

  const { onRefreshPage } = props;

  useEffect(() => {
    void onRefreshPage();
  }, [profile?.chainId, profile?.wallet]);

  return null;
};
