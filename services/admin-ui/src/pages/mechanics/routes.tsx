import type { RouteObject } from "react-router-dom";

import { breedRoutes } from "./breed/routes";
import { claimRoutes } from "./claim/routes";
import { dispenserRoutes } from "./dispenser/routes";
import { collectionRoutes } from "./collection/routes";
import { promoRoutes } from "./promo/routes";
import { gradeRoutes } from "./grade/routes";
import { lotteryRoutes } from "./lottery/routes";
import { mysteryRoutes } from "./mystery/routes";
import { ponziRoutes } from "./ponzi/routes";
import { paymentSplitterRoutes } from "./payment-splitter/routes";
import { raffleRoutes } from "./raffle/routes";
import { rentingRoutes } from "./rent/routes";
import { recipesRoutes } from "./recipes/routes";
import { stakingRoutes } from "./staking/routes";
import { vestingRoutes } from "./vesting/routes";
import { waitListRoutes } from "./wait-list/routes";
import { referralRoutes } from "./referral/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  ...breedRoutes,
  ...claimRoutes,
  ...collectionRoutes,
  ...dispenserRoutes,
  ...promoRoutes,
  ...gradeRoutes,
  ...lotteryRoutes,
  ...mysteryRoutes,
  ...ponziRoutes,
  ...paymentSplitterRoutes,
  ...raffleRoutes,
  ...recipesRoutes,
  ...rentingRoutes,
  ...stakingRoutes,
  ...vestingRoutes,
  ...waitListRoutes,
  ...referralRoutes,
];
