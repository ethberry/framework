import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { MyTransactions } from "./transactions";
import { MyWallet } from "./wallet";
import { MyTokensList } from "./tokens";
import { marketplaceRoutes } from "./marketplace/routes";

export const exchangeRoutes: Array<RouteObject> = [
  ...marketplaceRoutes,
  {
    path: "/transactions",
    element: <Protected />,
    children: [{ index: true, element: <MyTransactions /> }],
  },
  {
    path: "/wallet",
    element: <Protected />,
    children: [{ index: true, element: <MyWallet /> }],
  },
  {
    path: "/tokens",
    element: <Protected />,
    children: [{ index: true, element: <MyTokensList /> }],
  },
];
