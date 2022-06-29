import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Erc998Collection } from "./contract";
import { Erc998Template } from "./template";
import { Erc998Token } from "./token";

export const erc998Routes: Array<RouteObject> = [
  {
    path: "/erc998-contract",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Collection /> },
      { path: "/erc998-collections/:id", element: <Erc998Collection /> },
    ],
  },
  {
    path: "/erc998-templates",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Template /> },
      { path: "/erc998-templates/:id", element: <Erc998Template /> },
    ],
  },
  {
    path: "/erc998-tokens",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Token /> },
      { path: "/erc998-tokens/:id", element: <Erc998Token /> },
    ],
  },
];
