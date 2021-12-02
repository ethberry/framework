import { FC, Fragment, useContext } from "react";

import { UserContext } from "@gemunion/provider-user";

import { SocialLogin } from "@gemunion/common-pages";

export const Protected: FC = props => {
  const { children } = props;

  const user = useContext(UserContext);

  if (!user.isAuthenticated()) {
    return <SocialLogin />;
  }

  return <Fragment>{children}</Fragment>;
};
