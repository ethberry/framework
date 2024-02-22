import type { RouteObject } from "react-router-dom";

import { lotteryRoutes } from "./lottery/routes";
import { ponziRoutes } from "./ponzi/routes";
import { raffleRoutes } from "./raffle/routes";

export const gamblingMechanicsRoutes: Array<RouteObject> = [...lotteryRoutes, ...ponziRoutes, ...raffleRoutes];