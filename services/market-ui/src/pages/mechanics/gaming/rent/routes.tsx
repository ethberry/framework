import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Rent } from "./token-list";

export const rentingRoutes: Array<RouteObject> = [
  {
    path: "/rent",
    element: <Protected />,
    children: [{ index: true, element: <Rent /> }],
  },
];
