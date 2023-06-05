import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Marketplace } from "./marketplace";
import { MyTransactions } from "./transactions";
import { MyWallet } from "./wallet";
import { MyTokensList } from "./tokens";

export const exchangeRoutes: Array<RouteObject> = [
  {
    path: "/marketplace",
    children: [
      { index: true, element: <Marketplace /> },
      { path: "/marketplace/:tab", element: <Marketplace /> },
    ],
  },
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
