import type { RouteObject } from "react-router-dom";
import { Protected } from "@gemunion/firebase-login";

import { Claim } from "./claim";
import { ClaimWrapper } from "./claim/wrapper";
import { VestingWrapper } from "./vesting/wrapper";
import { Vesting } from "./vesting";
import { LootboxList } from "./lootbox-list";
import { Lootbox } from "./lootbox";
import { CraftList } from "./craft-list";
import { Craft } from "./craft";
import { stakingRoutes } from "./staking/routes";

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
      { path: "/craft/:id", element: <Craft /> },
    ],
  },
  {
    path: "/vesting",
    element: <VestingWrapper />,
    children: [{ index: true, element: <Vesting /> }],
  },
  ...stakingRoutes,
];
