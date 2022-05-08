import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Erc1155Token } from "./token";
import { Erc1155Collection } from "./collection";
import { Erc1155Recipes } from "./recipe";

export const erc1155Routes: Array<RouteObject> = [
  {
    path: "/erc1155-collections",
    element: <Protected />,
    children: [
      { index: true, element: <Erc1155Collection /> },
      { path: "/erc1155-collections/:id", element: <Erc1155Collection /> },
    ],
  },
  {
    path: "/erc1155-tokens",
    element: <Protected />,
    children: [
      { index: true, element: <Erc1155Token /> },
      { path: "/erc1155-tokens/:id", element: <Erc1155Token /> },
    ],
  },
  {
    path: "/erc1155-recipes",
    element: <Protected />,
    children: [
      { index: true, element: <Erc1155Recipes /> },
      { path: "/erc1155-recipes/:id", element: <Erc1155Recipes /> },
    ],
  },
];
