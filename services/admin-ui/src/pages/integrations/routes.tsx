import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { ChainLink } from "./chain-link";
import { CoinGecko } from "./coin-gecko";
import { CoinMarketCap } from "./coin-market-cap";
import { marketRoutes } from "./marketplace/routes";

export const integrationsRoutes: Array<RouteObject> = [
  {
    path: "/chain-link",
    element: <Protected />,
    children: [{ index: true, element: <ChainLink /> }],
  },
  {
    path: "/coin-gecko",
    element: <Protected />,
    children: [{ index: true, element: <CoinGecko /> }],
  },
  {
    path: "/coin-market-cap",
    element: <Protected />,
    children: [{ index: true, element: <CoinMarketCap /> }],
  },
  ...marketRoutes,
];
