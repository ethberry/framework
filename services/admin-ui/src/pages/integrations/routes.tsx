import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { ChainLink } from "./chain-link";
import { CoinGecko } from "./coin-gecko";

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
];
