import type { RouteObject } from "react-router-dom";
import { Protected } from "@gemunion/firebase-login";

import { CraftList } from "./craft";
import { Claim } from "./claim";
import { ClaimWrapper } from "./claim/wrapper";
import { VestingWrapper } from "./vesting/wrapper";
import { Vesting } from "./vesting";
import { Stake } from "./staking/stake";
import { Leaderboard } from "./staking/leaderboard";
import { Reward } from "./staking/reward";
import { LootboxList } from "./lootbox-list";
import { Lootbox } from "./lootbox";

export const mechanicsRoutes: Array<RouteObject> = [
  {
    path: "/claim",
    element: <ClaimWrapper />,
    children: [{ index: true, element: <Claim /> }],
  },
  {
    path: "/lootboxes",
    element: <Protected />,
    children: [
      { index: true, element: <LootboxList /> },
      { path: "/lootboxes/:id", element: <Lootbox /> },
    ],
  },
  {
    path: "/craft",
    element: <Protected />,
    children: [
      { index: true, element: <CraftList /> },
      { path: "/craft/:tab", element: <CraftList /> },
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
