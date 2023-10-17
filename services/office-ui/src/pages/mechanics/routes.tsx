import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { dispenserRoutes } from "./dispenser/routes";
import { promoRoutes } from "./promo/routes";
import { gradeRoutes } from "./grade/routes";
import { mysteryRoutes } from "./mystery/routes";
import { stakingRoutes } from "./staking/routes";
import { ponziRoutes } from "./ponzi/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitListRoutes } from "./wait-list/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...claimRoutes,
  ...dispenserRoutes,
  ...promoRoutes,
  ...gradeRoutes,
  ...mysteryRoutes,
  ...stakingRoutes,
  ...ponziRoutes,
  ...vestingRoutes,
  ...waitListRoutes,
];
