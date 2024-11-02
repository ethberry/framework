import type { RouteObject } from "react-router-dom";

import { LegacyVesting } from "./main";

export const legacyVestingRoutes: Array<RouteObject> = [
  {
    path: "/legacy-vesting",
    children: [
      { index: true, element: <LegacyVesting /> },
      { path: "/legacy-vesting/:id/:action", element: <LegacyVesting /> },
    ],
  },
];
