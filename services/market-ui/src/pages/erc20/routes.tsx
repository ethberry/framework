import type { RouteObject } from "react-router-dom";

import { Erc20Staking } from "./staking";
import { Erc20Vesting } from "./vesting";
import { Erc20VestingWrapper } from "./vesting/wrapper";

export const erc20Routes: Array<RouteObject> = [
  {
    path: "/erc20-staking",
    element: <Erc20Staking />,
  },
  {
    path: "/erc20-vesting",
    element: <Erc20VestingWrapper />,
    children: [{ index: true, element: <Erc20Vesting /> }],
  },
];
