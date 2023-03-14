import type { RouteObject } from "react-router-dom";

import { tokenRoutes } from "./tokens/routes";

export const hierarchyRoutes: Array<RouteObject> = [...tokenRoutes];
