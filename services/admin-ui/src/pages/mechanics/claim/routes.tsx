import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Claim } from "./main";

export const claimRoutes: Array<RouteObject> = [
  {
    path: "/claims",
    element: <Protected />,
    children: [
      { index: true, element: <Claim /> },
      { path: "/claims/:id", element: <Claim /> },
    ],
  },
];
