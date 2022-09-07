import type { RouteObject } from "react-router-dom";

import { DropList } from "./drop-list";

export const dropRoutes: Array<RouteObject> = [
  {
    path: "/drops",
    element: <DropList />,
  },
];
