import type { RouteObject } from "react-router-dom";

import { Leaderboard } from "./leaderboard";
import { Erc20Vesting } from "./vesting";
import { Erc20VestingWrapper } from "./vesting/wrapper";

export const erc20Routes: Array<RouteObject> = [
  {
    path: "/erc20-staking",
    element: <Leaderboard />,
  },
  {
    path: "/erc20-vesting",
    element: <Erc20VestingWrapper />,
    children: [{ index: true, element: <Erc20Vesting /> }],
  },
];
