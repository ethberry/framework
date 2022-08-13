import type { RouteObject } from "react-router-dom";

import { Claim } from "./main";
import { ClaimWrapper } from "./main/wrapper";

export const claimRoutes: Array<RouteObject> = [
  {
    path: "/claim",
    element: <ClaimWrapper />,
    children: [{ index: true, element: <Claim /> }],
  },
];
