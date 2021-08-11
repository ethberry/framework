import React, {createElement, FC, ReactElement, useContext, useEffect, useState} from "react";
import {Redirect, Route, RouteProps} from "react-router";

import {IUserContext, UserContext} from "@gemunionstudio/provider-user";

import {SocialLogin} from "@gemunionstudio/common-pages";
import {IUser, UserStatus} from "@gemunionstudio/solo-types";

interface IMyRouteProps extends RouteProps {
  restricted?: boolean;
}

export const MyRoute: FC<IMyRouteProps> = ({component, restricted, ...rest}) => {
  const user = useContext<IUserContext<IUser>>(UserContext);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(id);
  }, []);

  if (!isReady) {
    return null;
  }

  if (restricted) {
    if (!user.isAuthenticated()) {
      return <SocialLogin />;
    }
    if (user.profile.userStatus === UserStatus.PENDING) {
      return <Redirect to="/message/registration-successful" />;
    }
  }

  return (
    <Route {...rest} render={(props): ReactElement | null => (component ? createElement(component, props) : null)} />
  );
};
