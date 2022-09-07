import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Pyramid } from "./main";

export const pyramidRoutes: Array<RouteObject> = [
  {
    path: "/pyramid",
    element: <Protected />,
    children: [{ index: true, element: <Pyramid /> }],
  },
];
