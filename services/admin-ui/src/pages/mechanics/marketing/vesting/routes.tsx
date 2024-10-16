import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { VestingContracts } from "./contract";
import { IndexWrapper } from "../../../index-wrapper";
import { VestingSection } from "../../../dashboard/mechanics/vesting";

export const vestingRoutes: Array<RouteObject> = [
  {
    path: "/vesting",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="vesting">
            <VestingSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/vesting/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <VestingContracts /> },
          { path: "/vesting/contracts/:id/:action", element: <VestingContracts /> },
        ],
      },
    ],
  },
];
