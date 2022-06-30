import type { RouteObject } from "react-router-dom";

import { Leaderboard } from "./leaderboard";
import { Stake } from "./stake";
import { Reward } from "./reward";

export const stakingRoutes: Array<RouteObject> = [
  {
    path: "/staking-rules",
    children: [
      { index: true, element: <Stake /> },
      { path: "/staking-rules/leaderboard", element: <Leaderboard /> },
      { path: "/staking-rules/reward", element: <Reward /> },
    ],
  },
];
