import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Discrete } from "./main";

export const gradeRoutes: Array<RouteObject> = [
  {
    path: "/grades",
    element: <Protected />,
    children: [
      { index: true, element: <Discrete /> },
      { path: "/grades/:id", element: <Discrete /> },
    ],
  },
];
