import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Craft } from "./craft";
import { Dismantle } from "./dismantle";
import { Merge } from "./merge";
import { IndexWrapper } from "../../index-wrapper";
import { RecipesSection } from "../../dashboard/mechanics/recipes";

export const recipesRoutes: Array<RouteObject> = [
  {
    path: "/recipes",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="recipes">
            <RecipesSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/recipes/craft",
        element: <Protected />,
        children: [
          { index: true, element: <Craft /> },
          { path: "/recipes/craft/:id", element: <Craft /> },
        ],
      },
      {
        path: "/recipes/dismantle",
        element: <Protected />,
        children: [
          { index: true, element: <Dismantle /> },
          { path: "/recipes/dismantle/:id", element: <Dismantle /> },
        ],
      },
      {
        path: "/recipes/merge",
        element: <Protected />,
        children: [
          { index: true, element: <Merge /> },
          { path: "/recipes/merge/:id", element: <Merge /> },
        ],
      },
    ],
  },
];
