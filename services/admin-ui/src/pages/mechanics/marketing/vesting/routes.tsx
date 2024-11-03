import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { IndexWrapper } from "../../../index-wrapper";
import { VestingSection } from "../../../dashboard/mechanics/vesting";
import { VestingBox } from "./box";
import { VestingContract } from "./contract";
import { VestingToken } from "./token";
import { CreateVestingBox } from "./create";

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
          { index: true, element: <VestingContract /> },
          { path: "/vesting/contracts/:id/:action", element: <VestingContract /> },
        ],
      },
      {
        path: "/vesting/boxes",
        element: <Protected />,
        children: [
          { index: true, element: <VestingBox /> },

          { path: "/vesting/boxes/:id/:action", element: <VestingBox /> },
        ],
      },
      {
        path: "/vesting/box/create",
        element: <Protected />,
        children: [{ index: true, element: <CreateVestingBox /> }],
      },
      {
        path: "/vesting/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <VestingToken /> },

          { path: "/vesting/tokens/:id/:action", element: <VestingToken /> },
        ],
      },
    ],
  },
];
