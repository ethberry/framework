import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Mysterybox } from "./box";
import { MysteryboxContract } from "./contract";

export const mysteryboxRoutes: Array<RouteObject> = [
  {
    path: "/mysterybox-contracts",
    element: <Protected />,
    children: [
      { index: true, element: <MysteryboxContract /> },
      { path: "/mysterybox-contracts/:id", element: <MysteryboxContract /> },
    ],
  },
  {
    path: "/mysterybox-boxes",
    element: <Protected />,
    children: [
      { index: true, element: <Mysterybox /> },
      { path: "/mysterybox-boxes/:id", element: <Mysterybox /> },
    ],
  },
];
