import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../index-wrapper";
import { Erc1155Section } from "../../dashboard/hierarchy/erc1155";
import { Erc1155Template } from "./template";
import { Erc1155Contract } from "./contract";

export const erc1155Routes: Array<RouteObject> = [
  {
    path: "/erc1155",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="erc1155">
            <Erc1155Section />
          </IndexWrapper>
        ),
      },
      {
        path: "/erc1155/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <Erc1155Contract /> },
          { path: "/erc1155/contracts/:id", element: <Erc1155Contract /> },
        ],
      },
      {
        path: "/erc1155/templates",
        element: <Protected />,
        children: [
          { index: true, element: <Erc1155Template /> },
          { path: "/erc1155/templates/:id", element: <Erc1155Template /> },
        ],
      },
    ],
  },
];
