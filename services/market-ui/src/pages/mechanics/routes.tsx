import type { RouteObject } from "react-router-dom";

import { breedRoutes } from "./breed/routes";
import { claimRoutes } from "./claim/routes";
import { dropRoutes } from "./drop/routes";
import { lotteryRoutes } from "./lottery/routes";
import { mysteryboxRoutes } from "./mystery/routes";
import { ponziRoutes } from "./ponzi/routes";
import { raffleRoutes } from "./raffle/routes";
import { recipesRoutes } from "./recipes/craft/routes";
import { referralRoutes } from "./referral/routes";
import { rentingRoutes } from "./rent/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitlistRoutes } from "./wait-list/routes";
import { wrapperRoutes } from "./wrapper/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...breedRoutes,
  ...claimRoutes,
  ...dropRoutes,
  ...lotteryRoutes,
  ...mysteryboxRoutes,
  ...ponziRoutes,
  ...raffleRoutes,
  ...recipesRoutes,
  ...referralRoutes,
  ...rentingRoutes,
  ...stakingRoutes,
  ...vestingRoutes,
  ...waitlistRoutes,
  ...wrapperRoutes,
];
