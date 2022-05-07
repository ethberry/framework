import { FC } from "react";
import { Navigate, useRoutes } from "react-router";
import type { RouteObject } from "react-router-dom";
import { Error, Message } from "@gemunion/common-pages";
import { FirebaseLogin } from "@gemunion/firebase-login";

import { Layout } from "../components/common/layout";
import { Protected } from "./protected";

import { Landing } from "./landing";
import { Dashboard } from "./dashboard";
import { Profile } from "./profile";
import { User } from "./user";
import { Blockchain } from "./blockchain";

import { erc20Routes } from "./erc20/routes";
import { erc721Routes } from "./erc721/routes";
import { erc1155Routes } from "./erc1155/routes";

const routes: Array<RouteObject> = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      {
        path: "/login",
        element: <FirebaseLogin />,
      },
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
        path: "/blockchain",
        element: <Protected />,
        children: [{ index: true, element: <Blockchain /> }],
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
