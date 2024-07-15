import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Profile } from "./profile";
import { User } from "./user";
import { Page } from "./page";
import { Settings } from "./settings";
import { Email } from "./email";
import { Merchant } from "./merchant";
import { RatePlan } from "./rate-plan";

export const infrastructureRoutes: Array<RouteObject> = [
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
      { path: "/users/:id/:action", element: <User /> },
    ],
  },
  {
    path: "/merchants",
    element: <Protected />,
    children: [
      { index: true, element: <Merchant /> },
      { path: "/merchants/:id/:action", element: <Merchant /> },
    ],
  },
  {
    path: "/rate-plans",
    element: <Protected />,
    children: [
      { index: true, element: <RatePlan /> },
      { path: "/rate-plans/:tab", element: <RatePlan /> },
    ],
  },
  {
    path: "/pages",
    element: <Protected />,
    children: [
      { index: true, element: <Page /> },
      { path: "/pages/:id/:action", element: <Page /> },
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
