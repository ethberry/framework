import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { BreedBreeds } from "./breeds";
import { BreedHistory } from "./history";
import { IndexWrapper } from "../../index-wrapper";
import { Breed } from "../../dashboard/mechanics/breed";

export const breedRoutes: Array<RouteObject> = [
  {
    path: "/breed",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="breed">
            <Breed />
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
      {
        path: "/breed/history",
        element: <Protected />,
        children: [
          { index: true, element: <BreedHistory /> },
          { path: "/breed/history/:id", element: <BreedHistory /> },
        ],
      },
    ],
  },
];
