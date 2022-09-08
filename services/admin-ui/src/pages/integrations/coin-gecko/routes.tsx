import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { CoinGeckoRates } from "./rates";
import { CoinGeckoOhlc } from "./ohlc";

export const coinGeckoRoutes: Array<RouteObject> = [
  {
    path: "/coin-gecko",
    element: <Protected />,
    children: [
      {
        index: true,
        element: <Navigate to="/coin-gecko/rates" />,
      },
      { path: "/coin-gecko/rates", element: <CoinGeckoRates /> },
      { path: "/coin-gecko/ohlc", element: <CoinGeckoOhlc /> },
    ],
  },
];
