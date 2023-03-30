import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Collection } from "./contract";
import { Erc721Template } from "./template";
import { Erc721Token } from "./token";
import { IndexWrapper } from "../../index-wrapper";
import { Collections } from "../../dashboard/mechanics/collection";

export const erc721CollectionRoutes: Array<RouteObject> = [
  {
    path: "/collections",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="collections">
            <Collections />
          </IndexWrapper>
        ),
      },
      {
        path: "/collections/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <Collection /> },
          { path: "/collections/contracts/:id", element: <Collection /> },
        ],
      },
      {
        path: "/collections/templates",
        element: <Protected />,
        children: [
          { index: true, element: <Erc721Template /> },
          { path: "/collections/templates/:id", element: <Erc721Template /> },
        ],
      },
      {
        path: "/collections/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <Erc721Token /> },
          { path: "/collections/tokens/:id", element: <Erc721Token /> },
        ],
      },
    ],
  },
];
