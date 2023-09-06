import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { dispenserRoutes } from "./dispenser/routes";
import { dropRoutes } from "./drop/routes";
import { gradeRoutes } from "./grade/routes";
import { mysteryRoutes } from "./mystery/routes";
import { stakingRoutes } from "./staking/routes";
import { ponziRoutes } from "./ponzi/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitListRoutes } from "./wait-list/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...claimRoutes,
  ...dispenserRoutes,
  ...dropRoutes,
  ...gradeRoutes,
  ...mysteryRoutes,
  ...stakingRoutes,
  ...ponziRoutes,
  ...vestingRoutes,
  ...waitListRoutes,
];
