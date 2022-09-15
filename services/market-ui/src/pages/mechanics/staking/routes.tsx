import type { RouteObject } from "react-router-dom";

import { StakingRules } from "./rules";
import { StakingLeaderboard } from "./leaderboard";
import { StakingDeposit } from "./stakes";
import { IndexWrapper } from "../../index-wrapper";
import { Staking } from "../../dashboard/mechanics/staking";

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
        path: "/staking/rules",
        children: [
          { index: true, element: <StakingRules /> },
          { path: "/staking/rules/:id", element: <StakingRules /> },
        ],
      },
      { path: "/staking/leaderboard", element: <StakingLeaderboard /> },
      {
        path: "/staking/stakes",
        children: [
          { index: true, element: <StakingDeposit /> },
          { path: "/staking/stakes/:id", element: <StakingDeposit /> },
        ],
      },
    ],
  },
];
