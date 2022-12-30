import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";
import { StakingRules } from "./rules";
import { StakingReport } from "./report";
import { StakingChart } from "./chart";
import { IndexWrapper } from "../../index-wrapper";
import { Staking } from "../../dashboard/mechanics/staking";
import { StakingContracts } from "./contract";

export const stakingRoutes: Array<RouteObject> = [
  {
    path: "/staking",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="staking">
            <Staking />
          </IndexWrapper>
        ),
      },
      {
        path: "/staking/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <StakingContracts /> },
          { path: "/staking/contracts/:id", element: <StakingContracts /> },
        ],
      },
      {
        path: "/staking/rules",
        element: <Protected />,
        children: [
          { index: true, element: <StakingRules /> },
          { path: "/staking/rules/:id", element: <StakingRules /> },
        ],
      },
      {
        path: "/staking/report",
        element: <Protected />,
        children: [
          { index: true, element: <StakingReport /> },
          { path: "/staking/report", element: <StakingReport /> },
        ],
      },
      {
        path: "/staking/chart",
        element: <Protected />,
        children: [
          { index: true, element: <StakingChart /> },
          { path: "/staking/chart", element: <StakingChart /> },
        ],
      },
    ],
  },
];
