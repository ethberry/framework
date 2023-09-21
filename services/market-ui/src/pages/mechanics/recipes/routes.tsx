import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../index-wrapper";
import { RecipesSection } from "../../dashboard/mechanics/recipes";
import { CraftList } from "./craft/craft-list";
import { CraftItem } from "./craft/craft-item";

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
          { index: true, element: <CraftList /> },
          { path: "/recipes/craft/:id", element: <CraftItem /> },
        ],
      },
    ],
  },
];
