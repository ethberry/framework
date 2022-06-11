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
import { stakingRoutes } from "./staking/routes";

import { Marketplace } from "./marketplace";
import { Auctions } from "./auction";
import { Craft } from "./craft";
import { MyAssets } from "./personal/assets";
import { MyAuctions } from "./personal/auction";

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
      ...stakingRoutes,
      {
        path: "/marketplace",
        children: [
          { index: true, element: <Marketplace /> },
          { path: "/marketplace/:tab", element: <Marketplace /> },
        ],
      },
      {
        path: "/auctions",
        children: [
          { index: true, element: <Auctions /> },
          { path: "/auctions/:tab", element: <Auctions /> },
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
        path: "/my-auctions",
        element: <Protected />,
        children: [{ index: true, element: <MyAuctions /> }],
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
