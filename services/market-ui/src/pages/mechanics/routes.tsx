import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { craftRoutes } from "./craft/routes";
import { dropRoutes } from "./drop/routes";
import { lotteryRoutes } from "./lottery/routes";
import { mysteryboxRoutes } from "./mysterybox/routes";
import { referralRoutes } from "./referral/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...claimRoutes,
  ...craftRoutes,
  ...dropRoutes,
  ...lotteryRoutes,
  ...mysteryboxRoutes,
  ...referralRoutes,
  ...stakingRoutes,
  ...vestingRoutes,
];
