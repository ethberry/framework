import type { RouteObject } from "react-router-dom";

import { Leaderboard } from "./leaderboard";

export const erc20Routes: Array<RouteObject> = [
  {
    path: "/leaderboard",
    element: <Leaderboard />,
  },
];
