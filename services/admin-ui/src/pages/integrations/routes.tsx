import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { ChainLink } from "./chain-link";
import { CoinGecko } from "./coin-gecko";
import { MarketplaceReport } from "./marketplace/report";
import { MarketplaceChart } from "./marketplace/chart";

export const integrations: Array<RouteObject> = [
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
    path: "/marketplace",
    element: <Protected />,
    children: [
      { index: true, element: <Navigate to="/marketplace/report/search" /> },
      { path: "/marketplace/report/search", element: <MarketplaceReport /> },
      { path: "/marketplace/report/chart", element: <MarketplaceChart /> },
    ],
  },
];
