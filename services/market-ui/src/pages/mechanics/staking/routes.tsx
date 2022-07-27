import type { RouteObject } from "react-router-dom";

import { StakingRules } from "./rules";
import { Leaderboard } from "./leaderboard";
import { Reward } from "./reward";

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
      { path: "/staking/leaderboard", element: <Leaderboard /> },
      { path: "/staking/reward", element: <Reward /> },
    ],
  },
];
