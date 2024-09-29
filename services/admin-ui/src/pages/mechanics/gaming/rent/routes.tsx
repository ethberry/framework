import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { Rent } from "./main";

export const rentingRoutes: Array<RouteObject> = [
  {
    path: "/rents",
    element: <Protected />,
    children: [
      { index: true, element: <Rent /> },
      { path: "/rents/:id/:action", element: <Rent /> },
    ],
  },
];
