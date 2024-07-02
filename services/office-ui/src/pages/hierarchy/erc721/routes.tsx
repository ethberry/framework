import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Erc721Contract } from "./contract";
import { Erc721Template } from "./template";
import { Erc721Token } from "./token";
import { IndexWrapper } from "../../index-wrapper";
import { Erc721Section } from "../../dashboard/hierarchy/erc721";

export const erc721Routes: Array<RouteObject> = [
  {
    path: "/erc721",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="erc721">
            <Erc721Section />
          </IndexWrapper>
        ),
      },
      {
        path: "/erc721/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <Erc721Contract /> },
          { path: "/erc721/contracts/:id/:action", element: <Erc721Contract /> },
        ],
      },
      {
        path: "/erc721/templates",
        element: <Protected />,
        children: [
          { index: true, element: <Erc721Template /> },

          { path: "/erc721/templates/:id/:action", element: <Erc721Template /> },
        ],
      },
      {
        path: "/erc721/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <Erc721Token /> },

          { path: "/erc721/tokens/:id/:action", element: <Erc721Token /> },
        ],
      },
    ],
  },
];
