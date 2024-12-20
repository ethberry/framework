import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { ChainLink } from "./chain-link";
import { coinGeckoRoutes } from "./coin-gecko/routes";
import { coinMarketCapRoutes } from "./coin-market-cap/routes";

export const integrationsRoutes: Array<RouteObject> = [
  {
    path: "/chain-link",
    element: <Protected />,
    children: [{ index: true, element: <ChainLink /> }],
  },
  ...coinGeckoRoutes,
  ...coinMarketCapRoutes,
];
