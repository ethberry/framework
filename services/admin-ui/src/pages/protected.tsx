import { FC, Fragment, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { useUser } from "@gemunion/provider-user";
import { FirebaseLogin } from "@gemunion/firebase-login";

export const Protected: FC = () => {
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
    return <FirebaseLogin />;
  }

  return (
    <Fragment>
      <Outlet />
    </Fragment>
  );
};
