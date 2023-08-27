import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Craft } from "./craft";
import { Dismantle } from "./dismantle";
import { Merge } from "./merge";

export const craftRoutes: Array<RouteObject> = [
  {
    path: "/craft",
    element: <Protected />,
    children: [
      { index: true, element: <Craft /> },
      { path: "/craft/:id", element: <Craft /> },
    ],
  },
  {
    path: "/dismantle",
    element: <Protected />,
    children: [
      { index: true, element: <Dismantle /> },
      { path: "/dismantle/:id", element: <Dismantle /> },
    ],
  },
  {
    path: "/merge",
    element: <Protected />,
    children: [
      { index: true, element: <Merge /> },
      { path: "/merge/:id", element: <Merge /> },
    ],
  },
];
