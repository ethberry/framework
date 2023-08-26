import type { RouteObject } from "react-router-dom";

import { PonziRules } from "./rules";
import { PonziLeaderboard } from "./leaderboard";
import { PonziDeposit } from "./deposit";
import { IndexWrapper } from "../../index-wrapper";
import { PonziSection } from "../../dashboard/mechanics/ponzi";

export const ponziRoutes: Array<RouteObject> = [
  {
    path: "/ponzi",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="ponzi">
            <PonziSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/ponzi/rules",
        children: [
          { index: true, element: <PonziRules /> },
          { path: "/ponzi/rules/:id", element: <PonziRules /> },
        ],
      },
      { path: "/ponzi/leaderboard", element: <PonziLeaderboard /> },
      {
        path: "/ponzi/stakes",
        children: [
          { index: true, element: <PonziDeposit /> },
          { path: "/ponzi/stakes/:id", element: <PonziDeposit /> },
        ],
      },
    ],
  },
];
