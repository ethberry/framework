import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { useUser } from "@gemunion/provider-user";

import { SystemLogin } from "../../guest/system-login";

export interface ISystemProtectedProps {
  children?: ReactNode;
}

export const SystemProtected: FC<ISystemProtectedProps> = props => {
  const { children } = props;

  const [isReady, setIsReady] = useState(false);
  const user = useUser();

  useEffect(() => {
    const id = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  if (!isReady) {
    return null;
  }

  if (!user.isAuthenticated()) {
    return <SystemLogin />;
  }

  return children ? <Fragment>{children}</Fragment> : <Outlet />;
};

export const Protected = SystemProtected;
