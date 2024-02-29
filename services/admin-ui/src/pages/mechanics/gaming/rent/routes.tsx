import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Rent } from "./main";

export const rentingRoutes: Array<RouteObject> = [
  {
    path: "/rents",
    element: <Protected />,
    children: [
      { index: true, element: <Rent /> },
      { path: "/rents/:id", element: <Rent /> },
    ],
  },
];
