import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { MysteryboxList } from "./mysterybox-list";
import { MysteryboxItem } from "./mysterybox-item";

export const mysteryboxRoutes: Array<RouteObject> = [
  {
    path: "/mysteryboxes",
    element: <Protected />,
    children: [
      { index: true, element: <MysteryboxList /> },
      { path: "/mysteryboxes/:id", element: <MysteryboxItem /> },
    ],
  },
];
