import type { RouteObject } from "react-router-dom";

import { WalletWrapper } from "../../wallet-wrapper";
import { Whitelist } from "./main";

export const whitelistRoutes: Array<RouteObject> = [
  {
    path: "/whitelist",
    element: <WalletWrapper />,
    children: [{ index: true, element: <Whitelist /> }],
  },
];
