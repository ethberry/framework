import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Mysterybox } from "./main";

export const mysteryboxRoutes: Array<RouteObject> = [
  {
    path: "/mysteryboxes",
    element: <Protected />,
    children: [
      { index: true, element: <Mysterybox /> },
      { path: "/mysteryboxes/:id", element: <Mysterybox /> },
    ],
  },
];
