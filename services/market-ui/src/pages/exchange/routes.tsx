import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Marketplace } from "./marketplace";
import { MyWallet } from "./my-wallet";
import { tokenRoutes } from "./tokens/routes";

export const exchangeRoutes: Array<RouteObject> = [
  {
    path: "/marketplace",
    children: [
      { index: true, element: <Marketplace /> },
      { path: "/marketplace/:tab", element: <Marketplace /> },
    ],
  },
  {
    path: "/my-wallet",
    element: <Protected />,
    children: [{ index: true, element: <MyWallet /> }],
  },
  ...tokenRoutes,
];
