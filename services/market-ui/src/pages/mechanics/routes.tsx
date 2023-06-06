import type { RouteObject } from "react-router-dom";

import { breedRoutes } from "./breed/routes";
import { claimRoutes } from "./claim/routes";
import { craftRoutes } from "./craft/routes";
import { dropRoutes } from "./drop/routes";
import { lotteryRoutes } from "./lottery/routes";
import { mysteryboxRoutes } from "./mystery/routes";
import { pyramidRoutes } from "./pyramid/routes";
import { raffleRoutes } from "./raffle/routes";
import { referralRoutes } from "./referral/routes";
import { rentingRoutes } from "./rent/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitlistRoutes } from "./waitlist/routes";
import { wrapperRoutes } from "./wrapper/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...breedRoutes,
  ...claimRoutes,
  ...craftRoutes,
  ...dropRoutes,
  ...lotteryRoutes,
  ...mysteryboxRoutes,
  ...pyramidRoutes,
  ...raffleRoutes,
  ...referralRoutes,
  ...rentingRoutes,
  ...stakingRoutes,
  ...vestingRoutes,
  ...waitlistRoutes,
  ...wrapperRoutes,
];
