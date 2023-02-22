import type { RouteObject } from "react-router-dom";

import { Vesting } from "./main";

export const vestingRoutes: Array<RouteObject> = [
  {
    path: "/vesting",
    children: [
      { index: true, element: <Vesting /> },
      { path: "/vesting/:id", element: <Vesting /> },
    ],
  },
];
