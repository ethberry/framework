import type { RouteObject } from "react-router-dom";

import { breedRoutes } from "./breed/routes";
import { claimRoutes } from "./claim/routes";
import { dispenserRoutes } from "./dispenser/routes";
import { collectionRoutes } from "./collection/routes";
import { dropRoutes } from "./drop/routes";
import { gradeRoutes } from "./grade/routes";
import { lotteryRoutes } from "./lottery/routes";
import { mysteryRoutes } from "./mystery/routes";
import { ponziRoutes } from "./ponzi/routes";
import { raffleRoutes } from "./raffle/routes";
import { rentingRoutes } from "./rent/routes";
import { recipesRoutes } from "./recipes/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitListRoutes } from "./wait-list/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...breedRoutes,
  ...claimRoutes,
  ...collectionRoutes,
  ...dispenserRoutes,
  ...dropRoutes,
  ...gradeRoutes,
  ...lotteryRoutes,
  ...mysteryRoutes,
  ...ponziRoutes,
  ...raffleRoutes,
  ...recipesRoutes,
  ...rentingRoutes,
  ...stakingRoutes,
  ...vestingRoutes,
  ...waitListRoutes,
];
