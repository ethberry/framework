import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Craft } from "./main";

export const craftRoutes: Array<RouteObject> = [
  {
    path: "/craft",
    element: <Protected />,
    children: [
      { index: true, element: <Craft /> },
      { path: "/craft/:id", element: <Craft /> },
    ],
  },
];
