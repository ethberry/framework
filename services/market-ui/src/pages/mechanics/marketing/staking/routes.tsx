import type { RouteObject } from "react-router-dom";

import { StakingRules } from "./rules";
import { StakingLeaderboard } from "./leaderboard";
import { StakingDeposit } from "./deposit";
import { IndexWrapper } from "../../../index-wrapper";
import { StakingSection } from "../../../dashboard/mechanics/staking";

export const stakingRoutes: Array<RouteObject> = [
  {
    path: "/staking",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="staking">
            <StakingSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/staking/rules",
        children: [
          { index: true, element: <StakingRules /> },

          { path: "/staking/rules/:id/:action", element: <StakingRules /> },
        ],
      },
      { path: "/staking/leaderboard", element: <StakingLeaderboard /> },
      {
        path: "/staking/deposits",
        children: [
          { index: true, element: <StakingDeposit /> },

          { path: "/staking/deposits/:id/:action", element: <StakingDeposit /> },
        ],
      },
    ],
  },
];
