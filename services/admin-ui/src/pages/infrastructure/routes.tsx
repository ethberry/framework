import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Profile } from "./profile";
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
    path: "/merchant",
    element: <Protected />,
    children: [
      { index: true, element: <Merchant /> },
      { path: "/merchant/:tab", element: <Merchant /> },
    ],
  },
  {
    path: "/rate-plans",
    element: <Protected />,
    children: [{ index: true, element: <RatePlan /> }],
  },
];
