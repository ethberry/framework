import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Disperse } from "./main";

export const disperseRoutes: Array<RouteObject> = [
  {
    path: "/disperse",
    element: <Protected />,
    children: [{ index: true, element: <Disperse /> }],
  },
];
