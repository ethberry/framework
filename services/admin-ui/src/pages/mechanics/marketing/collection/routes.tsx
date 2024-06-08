import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { CollectionContract } from "./contract";
import { CollectionTemplate } from "./template";
import { CollectionToken } from "./token";
import { IndexWrapper } from "../../../index-wrapper";
import { CollectionSection } from "../../../dashboard/mechanics/collection";

export const collectionRoutes: Array<RouteObject> = [
  {
    path: "/collection",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="collection">
            <CollectionSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/collection/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <CollectionContract /> },
          { path: "/collection/contracts/:id/:action", element: <CollectionContract /> },
        ],
      },
      {
        path: "/collection/templates",
        element: <Protected />,
        children: [
          { index: true, element: <CollectionTemplate /> },
          { path: "/collection/templates/:id", element: <CollectionTemplate /> },
          { path: "/collection/templates/:id/:action", element: <CollectionTemplate /> },
        ],
      },
      {
        path: "/collection/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <CollectionToken /> },
          { path: "/collection/tokens/:id", element: <CollectionToken /> },
          { path: "/collection/tokens/:id/:action", element: <CollectionToken /> },
        ],
      },
    ],
  },
];
