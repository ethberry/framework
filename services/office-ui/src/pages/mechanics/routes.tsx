import type { RouteObject } from "react-router-dom";

import { claimRoutes } from "./claim/routes";
import { dropRoutes } from "./drop/routes";
import { stakingRoutes } from "./staking/routes";
import { pyramidRoutes } from "./pyramid/routes";

export const mechanicsRoutes: Array<RouteObject> = [...claimRoutes, ...dropRoutes, ...stakingRoutes, ...pyramidRoutes];
