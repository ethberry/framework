import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Whitelist } from "./main";

export const whitelistRoutes: Array<RouteObject> = [
  {
    path: "/whitelist",
    element: <Protected />,
    children: [{ index: true, element: <Whitelist /> }],
  },
];
