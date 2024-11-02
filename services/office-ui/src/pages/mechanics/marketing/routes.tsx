import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { dispenserRoutes } from "./dispenser/routes";
import { mysteryRoutes } from "./mystery/routes";
import { stakingRoutes } from "./staking/routes";
import { legacyVestingRoutes } from "./legacy-vesting/routes";
import { waitListRoutes } from "./wait-list/routes";

export const marketingMechanicsRoutes: Array<RouteObject> = [
  ...claimRoutes,
  ...dispenserRoutes,
  ...mysteryRoutes,
  ...stakingRoutes,
  ...legacyVestingRoutes,
  ...waitListRoutes,
];
