import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";
import { Staking } from "./rules";
import { Stakes } from "./stakes";
import { Statistics } from "./statistics";

export const stakingRoutes: Array<RouteObject> = [
  {
    path: "/staking",
    element: <Navigate to="/staking/rules" />,
  },
  {
    path: "/staking/rules",
    element: <Protected />,
    children: [
      { index: true, element: <Staking /> },
      { path: "/staking/rules/:id", element: <Staking /> },
    ],
  },
  {
    path: "/staking/stakes",
    element: <Protected />,
    children: [
      { index: true, element: <Stakes /> },
      { path: "/staking/stakes/:id", element: <Stakes /> },
    ],
  },
  {
    path: "/staking/statistics",
    element: <Protected />,
    children: [
      { index: true, element: <Statistics /> },
      { path: "/staking/statistics/:id", element: <Statistics /> },
    ],
  },
];
