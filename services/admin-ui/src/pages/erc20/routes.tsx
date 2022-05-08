import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Erc20Token } from "./token";
import { Erc20Vesting } from "./vesting";
import { Erc20Staking } from "./staking";

export const erc20Routes: Array<RouteObject> = [
  {
    path: "/erc20-tokens",
    element: <Protected />,
    children: [
      { index: true, element: <Erc20Token /> },
      { path: "/erc20-tokens/:id", element: <Erc20Token /> },
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
  {
    path: "/erc20-staking",
    element: <Protected />,
    children: [
      { index: true, element: <Erc20Staking /> },
      { path: "/erc20-staking/:id", element: <Erc20Staking /> },
    ],
  },
];
