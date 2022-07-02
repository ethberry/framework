import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Erc20Contract } from "./contract";

export const erc20Routes: Array<RouteObject> = [
  {
    path: "/erc20-contracts",
    element: <Protected />,
    children: [
      { index: true, element: <Erc20Contract /> },
      { path: "/erc20-contracts/:id", element: <Erc20Contract /> },
    ],
  },
];
