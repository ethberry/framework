import type { RouteObject } from "react-router-dom";

import { Claim } from "./main";
import { WalletWrapper } from "../../wallet-wrapper";

export const claimRoutes: Array<RouteObject> = [
  {
    path: "/claim",
    element: <WalletWrapper />,
    children: [{ index: true, element: <Claim /> }],
  },
];
