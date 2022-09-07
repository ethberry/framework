import type { RouteObject } from "react-router-dom";

import { ipfsRoutes } from "./ipfs/routes";

export const integrationsRoutes: Array<RouteObject> = [...ipfsRoutes];
