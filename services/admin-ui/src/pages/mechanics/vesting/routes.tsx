import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Vesting } from "./main";

export const vestingRoutes: Array<RouteObject> = [
  {
    path: "/vesting",
    element: <Protected />,
    children: [
      { index: true, element: <Vesting /> },
      { path: "/vesting/:id", element: <Vesting /> },
    ],
  },
];
