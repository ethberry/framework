import type { RouteObject } from "react-router-dom";

import { VestingWrapper } from "./main/wrapper";
import { Vesting } from "./main";

export const vestingRoutes: Array<RouteObject> = [
  {
    path: "/vesting",
    element: <VestingWrapper />,
    children: [
      { index: true, element: <Vesting /> },
      { path: "/vesting/:id", element: <Vesting /> },
    ],
  },
];
