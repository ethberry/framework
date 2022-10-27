import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { CoinMarketCap } from "./rates";

export const coinMarketCapRoutes: Array<RouteObject> = [
  {
    path: "/coin-market-cap",
    element: <Protected />,
    children: [
      {
        index: true,
        element: <Navigate to="/coin-market-cap/rates" />,
      },
      { path: "/coin-market-cap/rates", element: <CoinMarketCap /> },
    ],
  },
];
