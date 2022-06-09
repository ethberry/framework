import { FC } from "react";
import { Navigate, useRoutes } from "react-router";
import type { RouteObject } from "react-router-dom";
import { Error, Message } from "@gemunion/common-pages";
import { Protected, routes as loginRoutes } from "@gemunion/firebase-login";

import { Layout } from "../components/common/layout";

import { Landing } from "./landing";
import { Dashboard } from "./dashboard";
import { Profile } from "./profile";
import { User } from "./user";
import { Seaport } from "./seaport";

import { erc20Routes } from "./erc20/routes";
import { erc721Routes } from "./erc721/routes";
import { erc1155Routes } from "./erc1155/routes";
import { Settings } from "./settings";
import { Email } from "./email";
import { Staking } from "./staking";

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
      {
        path: "/users",
        element: <Protected />,
        children: [
          { index: true, element: <User /> },
          { path: "/users/:id", element: <User /> },
        ],
      },
      {
        path: "/settings",
        element: <Protected />,
        children: [{ index: true, element: <Settings /> }],
      },
      {
        path: "/emails",
        element: <Protected />,
        children: [{ index: true, element: <Email /> }],
      },
      {
        path: "/seaport",
        element: <Protected />,
        children: [{ index: true, element: <Seaport /> }],
      },
      {
        path: "/staking",
        element: <Protected />,
        children: [
          { index: true, element: <Staking /> },
          { path: "/staking/:id", element: <Staking /> },
        ],
      },
      ...erc20Routes,
      ...erc721Routes,
      ...erc1155Routes,
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
