import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { AssetPromo } from "./main";

export const promoRoutes: Array<RouteObject> = [
  {
    path: "/promos",
    element: <Protected />,
    children: [
      { index: true, element: <AssetPromo /> },
      { path: "/promos/:id", element: <AssetPromo /> },
    ],
  },
];
