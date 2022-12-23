import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Erc721Collection } from "./collection";
import { Erc721Template } from "./template";
import { Erc721Token } from "./token";

export const erc721CollectionRoutes: Array<RouteObject> = [
  {
    path: "/erc721-collections/contracts",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Collection /> },
      { path: "/erc721-collections/contracts/:id", element: <Erc721Collection /> },
    ],
  },
  {
    path: "/erc721-templates",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Template /> },
      { path: "/erc721-templates/:id", element: <Erc721Template /> },
    ],
  },
  {
    path: "/erc721-tokens",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Token /> },
      { path: "/erc721-tokens/:id", element: <Erc721Token /> },
    ],
  },
];
