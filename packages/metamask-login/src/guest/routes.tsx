import type { RouteObject } from "react-router-dom";

import { MetamaskLogin } from "./login";

export const routes: Array<RouteObject> = [
  {
    path: "/login",
    element: <MetamaskLogin />,
  },
];
