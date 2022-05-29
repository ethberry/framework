import { FC } from "react";
import { Navigate, useRoutes } from "react-router";
import type { RouteObject } from "react-router-dom";
import { Error, Message } from "@gemunion/common-pages";
import { Protected, routes as loginRoutes } from "@gemunion/firebase-login";

import { Layout } from "../components/common/layout";

import { Landing } from "./landing";
import { Dashboard } from "./dashboard";
import { Profile } from "./profile";

import { erc20Routes } from "./erc20/routes";
import { erc721Routes } from "./erc721/routes";
import { erc1155Routes } from "./erc1155/routes";

import { Marketplace } from "./marketplace";
import { Assets } from "./assets";
import { Craft } from "./craft";

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
      ...erc20Routes,
      ...erc721Routes,
      ...erc1155Routes,
      {
        path: "/marketplace",
        children: [
          { index: true, element: <Marketplace /> },
          { path: "/marketplace/:tab", element: <Marketplace /> },
        ],
      },
      {
        path: "/assets",
        element: <Protected />,
        children: [
          { index: true, element: <Assets /> },
          { path: "/assets/:tab", element: <Assets /> },
        ],
      },
      {
        path: "/craft",
        element: <Protected />,
        children: [
          { index: true, element: <Craft /> },
          { path: "/craft/:tab", element: <Craft /> },
        ],
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
