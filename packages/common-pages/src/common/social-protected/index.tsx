import { FC, Fragment, ReactNode } from "react";
import { Outlet } from "react-router-dom";

import { useUser } from "@gemunion/provider-user";

import { SocialLogin } from "../../guest/social-login";

export interface ISocialProtectedProps {
  children?: ReactNode;
}

export const SocialProtected: FC<ISocialProtectedProps> = props => {
  const { children } = props;

  const user = useUser();

  if (!user.isAuthenticated()) {
    return <SocialLogin />;
  }

  return children ? <Fragment>{children}</Fragment> : <Outlet />;
};
