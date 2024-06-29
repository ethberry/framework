import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Discrete } from "./main";

export const discreteRoutes: Array<RouteObject> = [
  {
    path: "/discrete",
    element: <Protected />,
    children: [
      { index: true, element: <Discrete /> },
      { path: "/discrete/:id", element: <Discrete /> },
    ],
  },
];
