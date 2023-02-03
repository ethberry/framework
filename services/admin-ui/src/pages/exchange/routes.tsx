import type { RouteObject } from "react-router-dom";

import { tokenRoutes } from "./tokens/routes";
import { walletRoutes } from "./wallet/routes";

export const exchangeRoutes: Array<RouteObject> = [...tokenRoutes, ...walletRoutes];
