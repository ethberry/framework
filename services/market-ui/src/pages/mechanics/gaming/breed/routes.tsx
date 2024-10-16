import type { RouteObject } from "react-router-dom";

import { Breed } from "./main";

export const breedRoutes: Array<RouteObject> = [
  {
    path: "/breed",
    children: [{ index: true, element: <Breed /> }],
  },
];
