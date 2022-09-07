import type { RouteObject } from "react-router-dom";

import { Vesting } from "./main";
import { WalletWrapper } from "../../wallet-wrapper";

export const vestingRoutes: Array<RouteObject> = [
  {
    path: "/vesting",
    element: <WalletWrapper />,
    children: [
      { index: true, element: <Vesting /> },
      { path: "/vesting/:id", element: <Vesting /> },
    ],
  },
];
