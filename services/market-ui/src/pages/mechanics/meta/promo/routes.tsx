import type { RouteObject } from "react-router-dom";

import { AssetPromoList } from "./promo-list";

export const promoRoutes: Array<RouteObject> = [
  {
    path: "/promos",
    element: <AssetPromoList />,
  },
];
