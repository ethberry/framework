import type { RouteObject } from "react-router-dom";

import { WalletWrapper } from "../../wallet-wrapper";
import { Waitlist } from "./main";

export const waitlistRoutes: Array<RouteObject> = [
  {
    path: "/waitlist",
    element: <WalletWrapper />,
    children: [{ index: true, element: <Waitlist /> }],
  },
];
