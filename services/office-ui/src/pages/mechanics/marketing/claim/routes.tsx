import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { ClaimTemplate } from "./template";
import { ClaimToken } from "./token";
import { IndexWrapper } from "../../../index-wrapper";
import { ClaimSection } from "../../../dashboard/mechanics/claim";

export const claimRoutes: Array<RouteObject> = [
  {
    path: "/claims",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="claims">
            <ClaimSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/claims/templates",
        element: <Protected />,
        children: [
          { index: true, element: <ClaimTemplate /> },
          { path: "/claims/templates/:id", element: <ClaimTemplate /> },
        ],
      },
      {
        path: "/claims/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <ClaimToken /> },
          { path: "/claims/tokens/:id", element: <ClaimToken /> },
        ],
      },
    ],
  },
];
