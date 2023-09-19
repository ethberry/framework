import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { CraftList } from "./craft-list";
import { CraftItem } from "./craft-item";

export const recipesRoutes: Array<RouteObject> = [
  {
    path: "/craft",
    element: <Protected />,
    children: [
      { index: true, element: <CraftList /> },
      { path: "/craft/:id", element: <CraftItem /> },
    ],
  },
];
