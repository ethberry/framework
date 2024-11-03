import { RouteObject } from "react-router-dom";

import { VestingBoxList } from "./box-list";
import { VestingBox } from "./box";

export const vestingRoutes: Array<RouteObject> = [
  {
    path: "/vesting/boxes",
    children: [
      { index: true, element: <VestingBoxList /> },

      { path: "/vesting/boxes/:id/:action", element: <VestingBox /> },
    ],
  },
];
