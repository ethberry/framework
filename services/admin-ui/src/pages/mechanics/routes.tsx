import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { craftRoutes } from "./craft/routes";
import { dropRoutes } from "./drop/routes";
import { gradeRoutes } from "./grade/routes";
import { lotteryRoutes } from "./lottery/routes";
import { mysteryRoutes } from "./mystery/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...claimRoutes,
  ...craftRoutes,
  ...dropRoutes,
  ...gradeRoutes,
  ...lotteryRoutes,
  ...mysteryRoutes,
  ...stakingRoutes,
  ...vestingRoutes,
];
