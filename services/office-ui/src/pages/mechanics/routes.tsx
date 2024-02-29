import type { RouteObject } from "react-router-dom";

import { gamblingMechanicsRoutes } from "./gambling/routes";
import { gamingMechanicsRoutes } from "./gaming/routes";
import { marketingMechanicsRoutes } from "./marketing/routes";
import { metaMechanicsRoutes } from "./meta/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...gamblingMechanicsRoutes,
  ...gamingMechanicsRoutes,
  ...marketingMechanicsRoutes,
  ...metaMechanicsRoutes,
];
