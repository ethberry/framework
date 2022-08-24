import { FC } from "react";
import { Navigate, useRoutes } from "react-router";
import type { RouteObject } from "react-router-dom";
import { Error, Message } from "@gemunion/common-pages";
import { Protected, routes as loginRoutes } from "@gemunion/firebase-login";

import { Layout } from "../components/common/layout";

import { Landing } from "./landing";
import { Dashboard } from "./dashboard";
import { Profile } from "./profile";

import { mechanicsRoutes } from "./mechanics/routes";
import { integrationsRoutes } from "./integrations/routes";
import { tokenRoutes } from "./tokens/routes";

import { Marketplace } from "./marketplace";
import { MyWallet } from "./my-wallet";
import { Page } from "./page";

const routes: Array<RouteObject> = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      ...loginRoutes,
      {
        path: "/dashboard",
        element: <Protected />,
        children: [{ index: true, element: <Dashboard /> }],
      },
      {
        path: "/profile",
        element: <Protected />,
        children: [
          { index: true, element: <Profile /> },
          { path: "/profile/:tab", element: <Profile /> },
        ],
      },
      ...mechanicsRoutes,
      ...integrationsRoutes,
      ...tokenRoutes,
      {
        path: "/marketplace",
        children: [
          { index: true, element: <Marketplace /> },
          { path: "/marketplace/:tab", element: <Marketplace /> },
        ],
      },
      {
        path: "/my-wallet",
        element: <Protected />,
        children: [{ index: true, element: <MyWallet /> }],
      },
      {
        path: "/pages/:slug",
        element: <Page />,
      },
      {
        path: "/error/:error",
        element: <Error />,
      },
      {
        path: "/message/:message",
        element: <Message />,
      },
      { path: "*", element: <Navigate to="/message/page-not-found" /> },
    ],
  },
];

export const Routes: FC = () => {
  return useRoutes(routes);
};
