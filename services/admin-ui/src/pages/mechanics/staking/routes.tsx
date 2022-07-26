import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";
import { Staking } from "./staking-rules";
import { Stakes } from "./staking-stakes";

export const stakingRoutes: Array<RouteObject> = [
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
];
