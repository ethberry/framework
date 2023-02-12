import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Erc721Contract } from "./contract";
import { Erc721Template } from "./template";
import { Erc721Token } from "./token";

export const erc721Routes: Array<RouteObject> = [
  {
    path: "/erc721-contracts",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Contract /> },
      { path: "/erc721-contracts/:id", element: <Erc721Contract /> },
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
