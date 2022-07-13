import { FC } from "react";
import { Navigate, useRoutes } from "react-router";
import type { RouteObject } from "react-router-dom";
import { Error, Message } from "@gemunion/common-pages";
import { Protected, routes as loginRoutes } from "@gemunion/firebase-login";

import { Layout } from "../components/common/layout";

import { Landing } from "./landing";
import { Dashboard } from "./dashboard";
import { Profile } from "./profile";

import { erc721Routes } from "./erc721/routes";
import { erc998Routes } from "./erc998/routes";
import { erc1155Routes } from "./erc1155/routes";
import { mechanicsRoutes } from "./mechanics/routes";

import { Marketplace } from "./mechanics/marketplace";
import { MyAssets } from "./personal/assets";
import { MyWallet } from "./connect-wallet";
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
      ...erc721Routes,
      ...erc998Routes,
      ...erc1155Routes,
      ...mechanicsRoutes,
      {
        path: "/marketplace",
        children: [
          { index: true, element: <Marketplace /> },
          { path: "/marketplace/:tab", element: <Marketplace /> },
        ],
      },
      {
        path: "/my-assets",
        element: <Protected />,
        children: [
          { index: true, element: <MyAssets /> },
          { path: "/my-assets/:tab", element: <MyAssets /> },
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
