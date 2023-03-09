import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Marketplace } from "./marketplace";
import { tokenRoutes } from "./tokens/routes";
import { MyTransactions } from "./transactions";
import { MyWallet } from "./wallet";

export const exchangeRoutes: Array<RouteObject> = [
  {
    path: "/marketplace",
    children: [
      { index: true, element: <Marketplace /> },
      { path: "/marketplace/:tab", element: <Marketplace /> },
    ],
  },
  {
    path: "/my-transactions",
    element: <Protected />,
    children: [{ index: true, element: <MyTransactions /> }],
  },
  {
    path: "/my-wallet",
    element: <Protected />,
    children: [{ index: true, element: <MyWallet /> }],
  },
  ...tokenRoutes,
];
