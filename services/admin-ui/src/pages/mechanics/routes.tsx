import type { RouteObject } from "react-router-dom";

import { breedRoutes } from "./breed/routes";
import { claimRoutes } from "./claim/routes";
import { craftRoutes } from "./craft/routes";
import { disperseRoutes } from "./disperse/routes";
import { collectionRoutes } from "./collection/routes";
import { dropRoutes } from "./drop/routes";
import { gradeRoutes } from "./grade/routes";
import { lotteryRoutes } from "./lottery/routes";
import { mysteryRoutes } from "./mystery/routes";
import { pyramidRoutes } from "./pyramid/routes";
import { raffleRoutes } from "./raffle/routes";
import { rentingRoutes } from "./rent/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitlistRoutes } from "./waitlist/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...breedRoutes,
  ...claimRoutes,
  ...collectionRoutes,
  ...craftRoutes,
  ...disperseRoutes,
  ...dropRoutes,
  ...gradeRoutes,
  ...lotteryRoutes,
  ...mysteryRoutes,
  ...pyramidRoutes,
  ...raffleRoutes,
  ...rentingRoutes,
  ...stakingRoutes,
  ...vestingRoutes,
  ...waitlistRoutes,
];
