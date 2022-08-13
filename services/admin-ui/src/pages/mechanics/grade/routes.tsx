import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Grade } from "./main";

export const gradeRoutes: Array<RouteObject> = [
  {
    path: "/grades",
    element: <Protected />,
    children: [
      { index: true, element: <Grade /> },
      { path: "/grades/:id", element: <Grade /> },
    ],
  },
];
