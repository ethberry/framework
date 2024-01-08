import { FC, Fragment, PropsWithChildren, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { useUser } from "@gemunion/provider-user";

export const MetamaskProtected: FC<PropsWithChildren> = props => {
  const { children } = props;

  const [isReady, setIsReady] = useState(false);
  const user = useUser<any>();

  useEffect(() => {
    const id = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  if (!isReady) {
    return null;
  }

  if (!user.isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children ? <Fragment>{children}</Fragment> : <Outlet />;
};

export const Protected = MetamaskProtected;
