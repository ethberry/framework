import type { RouteObject } from "react-router-dom";

import { StakingRules } from "./rules";
import { StakingLeaderboard } from "./leaderboard";
import { StakingStakes } from "./stakes";

export const stakingRoutes: Array<RouteObject> = [
  {
    path: "/staking",
    children: [
      { index: true, element: <StakingRules /> },
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
          { index: true, element: <StakingStakes /> },
          { path: "/staking/stakes/:id", element: <StakingStakes /> },
        ],
      },
    ],
  },
];
