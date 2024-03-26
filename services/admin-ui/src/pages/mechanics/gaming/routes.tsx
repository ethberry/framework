import type { RouteObject } from "react-router-dom";

import { breedRoutes } from "./breed/routes";
import { gradeRoutes } from "./discrete/routes";
import { recipesRoutes } from "./recipes/routes";
import { rentingRoutes } from "./rent/routes";

export const gamingMechanicsRoutes: Array<RouteObject> = [
  ...breedRoutes,
  ...gradeRoutes,
  ...recipesRoutes,
  ...rentingRoutes,
];
