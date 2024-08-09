import type { RouteObject } from "react-router-dom";

import { CoinGecko } from "./coin-gecko";
import { ipfsRoutes } from "./ipfs/routes";

export const integrationsRoutes: Array<RouteObject> = [
  {
    path: "/coin-gecko",
    children: [{ index: true, element: <CoinGecko /> }],
  },
  ...ipfsRoutes,
];
