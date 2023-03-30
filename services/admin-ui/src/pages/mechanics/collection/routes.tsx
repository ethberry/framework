import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { CollectionContract } from "./contract";
import { CollectionTemplate } from "./template";
import { CollectionToken } from "./token";
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
          { index: true, element: <CollectionContract /> },
          { path: "/collections/contracts/:id", element: <CollectionContract /> },
        ],
      },
      {
        path: "/collections/templates",
        element: <Protected />,
        children: [
          { index: true, element: <CollectionTemplate /> },
          { path: "/collections/templates/:id", element: <CollectionTemplate /> },
        ],
      },
      {
        path: "/collections/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <CollectionToken /> },
          { path: "/collections/tokens/:id", element: <CollectionToken /> },
        ],
      },
    ],
  },
];
