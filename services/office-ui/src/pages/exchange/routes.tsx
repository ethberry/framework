import type { RouteObject } from "react-router-dom";

import { walletRoutes } from "./wallet/routes";
import { marketRoutes } from "./marketplace/routes";

export const exchangeRoutes: Array<RouteObject> = [...marketRoutes, ...walletRoutes];
