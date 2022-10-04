import type { RouteObject } from "react-router-dom";

import { OneInch } from "./1inch";
import { CoinGecko } from "./coin-gecko";
import { ipfsRoutes } from "./ipfs/routes";

export const integrationsRoutes: Array<RouteObject> = [
  {
    path: "/1inch",
    children: [{ index: true, element: <OneInch /> }],
  },
  {
    path: "/coin-gecko",
    children: [{ index: true, element: <CoinGecko /> }],
  },
  ...ipfsRoutes,
];
