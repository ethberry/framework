import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { IndexWrapper } from "../../../index-wrapper";
import { AchievementsSection } from "../../../dashboard/mechanics/achievements";
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
        path: "/achievements/report",
        element: <Protected />,
        children: [{ index: true, element: <AchievementReport /> }],
      },
    ],
  },
];
