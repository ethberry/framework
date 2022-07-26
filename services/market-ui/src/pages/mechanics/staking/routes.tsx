import type { RouteObject } from "react-router-dom";

import { Stake } from "./stake";
import { Leaderboard } from "./leaderboard";
import { Reward } from "./reward";

export const stakingRoutes: Array<RouteObject> = [
  {
    path: "/staking",
    children: [
      { index: true, element: <Stake /> },
      { path: "/staking/leaderboard", element: <Leaderboard /> },
      { path: "/staking/reward", element: <Reward /> },
    ],
  },
];
