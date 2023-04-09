import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { BreedBreeds } from "./breeds";
import { IndexWrapper } from "../../index-wrapper";
import { BreedSection } from "../../dashboard/mechanics/breed";

export const breedRoutes: Array<RouteObject> = [
  {
    path: "/breed",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="breed">
            <BreedSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/breed/breeds",
        element: <Protected />,
        children: [
          { index: true, element: <BreedBreeds /> },
          { path: "/breed/breeds/:id", element: <BreedBreeds /> },
        ],
      },
    ],
  },
];
