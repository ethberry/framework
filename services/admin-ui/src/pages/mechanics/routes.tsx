import type { RouteObject } from "react-router-dom";

import { metaMechanicsRoutes } from "./meta/routes";
import { gamblingMechanicsRoutes } from "./gambling/routes";
import { gamingMechanicsRoutes } from "./gaming/routes";
import { marketingMechanicsRoutes } from "./marketing/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...gamingMechanicsRoutes,
  ...gamblingMechanicsRoutes,
  ...metaMechanicsRoutes,
  ...marketingMechanicsRoutes,
];
