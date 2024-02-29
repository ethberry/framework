import type { RouteObject } from "react-router-dom";

import { achievementsRoutes } from "./achievements/routes";
import { paymentSplitterRoutes } from "./payment-splitter/routes";
import { promoRoutes } from "./promo/routes";
import { referralRoutes } from "./referral/routes";

export const metaMechanicsRoutes: Array<RouteObject> = [
  ...achievementsRoutes,
  ...paymentSplitterRoutes,
  ...promoRoutes,
  ...referralRoutes,
];
