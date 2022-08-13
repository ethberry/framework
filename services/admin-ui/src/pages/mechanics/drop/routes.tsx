import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Drop } from "./main";

export const dropRoutes: Array<RouteObject> = [
  {
    path: "/drops",
    element: <Protected />,
    children: [
      { index: true, element: <Drop /> },
      { path: "/drops/:id", element: <Drop /> },
    ],
  },
];
