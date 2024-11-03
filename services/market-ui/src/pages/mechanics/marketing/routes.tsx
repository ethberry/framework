import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { legacyVestingRoutes } from "./legacy-vesting/routes";
import { lootRoutes } from "./loot/routes";
import { mysteryRoutes } from "./mystery/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitListRoutes } from "./wait-list/routes";
import { wrapperRoutes } from "./wrapper/routes";

export const marketingMechanicsRoutes: Array<RouteObject> = [
  ...claimRoutes,
  ...lootRoutes,
  ...mysteryRoutes,
  ...stakingRoutes,
  ...legacyVestingRoutes,
  ...vestingRoutes,
  ...waitListRoutes,
  ...wrapperRoutes,
];
