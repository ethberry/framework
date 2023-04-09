import type { RouteObject } from "react-router-dom";

import { PyramidRules } from "./rules";
import { PyramidLeaderboard } from "./leaderboard";
import { PyramidDeposit } from "./deposit";
import { IndexWrapper } from "../../index-wrapper";
import { PyramidSection } from "../../dashboard/mechanics/pyramid";

export const pyramidRoutes: Array<RouteObject> = [
  {
    path: "/pyramid",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="pyramid">
            <PyramidSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/pyramid/rules",
        children: [
          { index: true, element: <PyramidRules /> },
          { path: "/pyramid/rules/:id", element: <PyramidRules /> },
        ],
      },
      { path: "/pyramid/leaderboard", element: <PyramidLeaderboard /> },
      {
        path: "/pyramid/stakes",
        children: [
          { index: true, element: <PyramidDeposit /> },
          { path: "/pyramid/stakes/:id", element: <PyramidDeposit /> },
        ],
      },
    ],
  },
];
