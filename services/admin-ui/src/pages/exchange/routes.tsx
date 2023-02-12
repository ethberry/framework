import type { RouteObject } from "react-router-dom";

import { walletRoutes } from "./wallet/routes";

export const exchangeRoutes: Array<RouteObject> = [...walletRoutes];
