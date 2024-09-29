import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { Dispenser } from "./main";

export const dispenserRoutes: Array<RouteObject> = [
  {
    path: "/dispenser",
    element: <Protected />,
    children: [{ index: true, element: <Dispenser /> }],
  },
];
