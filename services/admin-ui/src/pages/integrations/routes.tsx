import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { ChainLink } from "./chain-link";
import { CoinGecko } from "./coin-gecko";
import { CoinMarketCap } from "./coin-market-cap";
import { MarketplaceReport } from "./marketplace/report";
import { MarketplaceChart } from "./marketplace/chart";
import { MarketplaceGrade } from "./marketplace/grade";
import { MarketplaceRarity } from "./marketplace/rarity";

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
  {
    path: "/marketplace",
    element: <Protected />,
    children: [
      { index: true, element: <Navigate to="/marketplace/report/search" /> },
      { path: "/marketplace/report/search", element: <MarketplaceReport /> },
      { path: "/marketplace/report/chart", element: <MarketplaceChart /> },
      { path: "/marketplace/report/rarity", element: <MarketplaceRarity /> },
      { path: "/marketplace/report/grade", element: <MarketplaceGrade /> },
    ],
  },
];
