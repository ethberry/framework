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

import { Settings } from "./settings";
import { Email } from "./email";
import { Page } from "./page";
import { mechanicsRoutes } from "./mechanics/routes";
import { integrations } from "./integrations/routes";
import { tokenRoutes } from "./hierarchy/routes";

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
        path: "/pages",
        element: <Protected />,
        children: [
          { index: true, element: <Page /> },
          { path: "/pages/:id", element: <Page /> },
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
      ...tokenRoutes,
      ...mechanicsRoutes,
      ...integrations,
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
