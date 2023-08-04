import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { dispenserRoutes } from "./dispenser/routes";
import { dropRoutes } from "./drop/routes";
import { stakingRoutes } from "./staking/routes";
import { pyramidRoutes } from "./pyramid/routes";
import { vestingRoutes } from "./vesting/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...claimRoutes,
  ...dispenserRoutes,
  ...dropRoutes,
  ...stakingRoutes,
  ...pyramidRoutes,
  ...vestingRoutes,
];
