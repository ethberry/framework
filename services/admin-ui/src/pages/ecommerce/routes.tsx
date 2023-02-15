import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Profile } from "./profile";
import { User } from "./user";
import { Page } from "./page";
import { Settings } from "./settings";
import { Email } from "./email";

export const ecommerceRoutes: Array<RouteObject> = [
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
];
