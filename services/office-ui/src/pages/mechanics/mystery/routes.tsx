import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../index-wrapper";
import { MysterySection } from "../../dashboard/mechanics/mystery";
import { MysteryBox } from "./box";
import { MysteryContract } from "./contract";
import { MysteryToken } from "./token";

export const mysteryRoutes: Array<RouteObject> = [
  {
    path: "/mystery",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="mystery">
            <MysterySection />
          </IndexWrapper>
        ),
      },
      {
        path: "/mystery/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <MysteryContract /> },
          { path: "/mystery/contracts/:id", element: <MysteryContract /> },
        ],
      },
      {
        path: "/mystery/boxes",
        element: <Protected />,
        children: [
          { index: true, element: <MysteryBox /> },
          { path: "/mystery/boxes/:id", element: <MysteryBox /> },
        ],
      },
      {
        path: "/mystery/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <MysteryToken /> },
          { path: "/mystery/tokens/:id", element: <MysteryToken /> },
        ],
      },
    ],
  },
];
