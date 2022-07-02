import type { RouteObject } from "react-router-dom";
import { Protected } from "@gemunion/firebase-login";

import { ExchangeList } from "./exchange";
import { Airdrop } from "./airdrop";
import { AirdropWrapper } from "./airdrop/wrapper";
import { VestingWrapper } from "./vesting/wrapper";
import { Vesting } from "./vesting";
import { Stake } from "./staking/stake";
import { Leaderboard } from "./staking/leaderboard";
import { Reward } from "./staking/reward";

export const mechanicsRoutes: Array<RouteObject> = [
  {
    path: "/airdrop",
    element: <AirdropWrapper />,
    children: [{ index: true, element: <Airdrop /> }],
  },
  {
    path: "/exchange",
    element: <Protected />,
    children: [
      { index: true, element: <ExchangeList /> },
      { path: "/exchange/:tab", element: <ExchangeList /> },
    ],
  },
  {
    path: "/staking",
    children: [
      { index: true, element: <Stake /> },
      { path: "/staking/leaderboard", element: <Leaderboard /> },
      { path: "/staking/reward", element: <Reward /> },
    ],
  },
  {
    path: "/vesting",
    element: <VestingWrapper />,
    children: [{ index: true, element: <Vesting /> }],
  },
];
