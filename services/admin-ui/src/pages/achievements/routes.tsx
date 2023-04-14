import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../index-wrapper";
import { AchievementsSection } from "../dashboard/achievements";
import { AchievementLevels } from "./levels";

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
        path: "/achievements/levels",
        element: <Protected />,
        children: [
          { index: true, element: <AchievementLevels /> },
          { path: "/achievements/levels/:id", element: <AchievementLevels /> },
        ],
      },
    ],
  },
];
