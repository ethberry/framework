import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { IndexWrapper } from "../../../index-wrapper";
import { AchievementsSection } from "../../../dashboard/mechanics/achievements";
import { AchievementLevels } from "./levels";
import { AchievementRules } from "./rule";
import { AchievementReport } from "./report";

export const achievementsRoutes: Array<RouteObject> = [
  {
    path: "/achievements",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="achievements">
            <AchievementsSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/achievements/rules",
        element: <Protected />,
        children: [
          { index: true, element: <AchievementRules /> },

          { path: "/achievements/rules/:id/:action", element: <AchievementRules /> },
        ],
      },
      {
        path: "/achievements/levels",
        element: <Protected />,
        children: [
          { index: true, element: <AchievementLevels /> },

          { path: "/achievements/levels/:id/:action", element: <AchievementLevels /> },
        ],
      },
      {
        path: "/achievements/report",
        element: <Protected />,
        children: [{ index: true, element: <AchievementReport /> }],
      },
    ],
  },
];
