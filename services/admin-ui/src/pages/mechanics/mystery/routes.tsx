import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { MysteryBox } from "./box";
import { MysteryboxContract } from "./contract";
import { MysteryToken } from "./token";

export const mysteryRoutes: Array<RouteObject> = [
  {
    path: "/mystery-contracts",
    element: <Protected />,
    children: [
      { index: true, element: <MysteryboxContract /> },
      { path: "/mystery-contracts/:id", element: <MysteryboxContract /> },
    ],
  },
  {
    path: "/mystery-boxes",
    element: <Protected />,
    children: [
      { index: true, element: <MysteryBox /> },
      { path: "/mystery-boxes/:id", element: <MysteryBox /> },
    ],
  },
  {
    path: "/mystery-tokens",
    element: <Protected />,
    children: [
      { index: true, element: <MysteryToken /> },
      { path: "/mystery-tokens/:id", element: <MysteryToken /> },
    ],
  },
];
