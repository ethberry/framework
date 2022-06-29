import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Erc20Contract } from "./contract";
import { Erc20Vesting } from "./vesting";

export const erc20Routes: Array<RouteObject> = [
  {
    path: "/erc20-tokens",
    element: <Protected />,
    children: [
      { index: true, element: <Erc20Contract /> },
      { path: "/erc20-tokens/:id", element: <Erc20Contract /> },
    ],
  },
  {
    path: "/erc20-vesting",
    element: <Protected />,
    children: [
      { index: true, element: <Erc20Vesting /> },
      { path: "/erc20-vesting/:id", element: <Erc20Vesting /> },
    ],
  },
];
