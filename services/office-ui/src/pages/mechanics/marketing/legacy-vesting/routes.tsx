import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { LegacyVestingContracts } from "./contract";
import { IndexWrapper } from "../../../index-wrapper";
import { LegacyVestingSection } from "../../../dashboard/mechanics/legacy-vesting";

export const legacyVestingRoutes: Array<RouteObject> = [
  {
    path: "/legacy-vesting",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="legacy-vesting">
            <LegacyVestingSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/legacy-vesting/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <LegacyVestingContracts /> },
          { path: "/legacy-vesting/contracts/:id/:action", element: <LegacyVestingContracts /> },
        ],
      },
    ],
  },
];
