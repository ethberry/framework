import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Erc1155Template } from "./template";
import { Erc1155Contract } from "./contract";

export const erc1155Routes: Array<RouteObject> = [
  {
    path: "/erc1155-contracts",
    element: <Protected />,
    children: [
      { index: true, element: <Erc1155Contract /> },
      { path: "/erc1155-contracts/:id", element: <Erc1155Contract /> },
    ],
  },
  {
    path: "/erc1155-templates",
    element: <Protected />,
    children: [
      { index: true, element: <Erc1155Template /> },
      { path: "/erc1155-templates/:id", element: <Erc1155Template /> },
    ],
  },
];
