import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { collectionRoutes } from "./collection/routes";
import { dispenserRoutes } from "./dispenser/routes";
import { lootRoutes } from "./loot/routes";
import { mysteryRoutes } from "./mystery/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitListRoutes } from "./wait-list/routes";

export const marketingMechanicsRoutes: Array<RouteObject> = [
  ...claimRoutes,
  ...collectionRoutes,
  ...dispenserRoutes,
  ...lootRoutes,
  ...mysteryRoutes,
  ...stakingRoutes,
  ...vestingRoutes,
  ...waitListRoutes,
];
