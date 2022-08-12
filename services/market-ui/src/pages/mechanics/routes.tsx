import type { RouteObject } from "react-router-dom";
import { Protected } from "@gemunion/firebase-login";

import { Claim } from "./claim";
import { ClaimWrapper } from "./claim/wrapper";
import { VestingWrapper } from "./vesting/wrapper";
import { Vesting } from "./vesting";
import { MysteryboxList } from "./mysterybox-list";
import { Mysterybox } from "./mysterybox";
import { CraftList } from "./craft-list";
import { Craft } from "./craft";
import { DropList } from "./drop-list";
import { stakingRoutes } from "./staking/routes";
import { referralRoutes } from "./referral/routes";
import { lotteryRoutes } from "./lottery/routes";

export const mechanicsRoutes: Array<RouteObject> = [
  {
    path: "/claim",
    element: <ClaimWrapper />,
    children: [{ index: true, element: <Claim /> }],
  },
  {
    path: "/drops",
    element: <DropList />,
  },
  {
    path: "/mysteryboxes",
    element: <Protected />,
    children: [
      { index: true, element: <MysteryboxList /> },
      { path: "/mysteryboxes/:id", element: <Mysterybox /> },
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
  ...referralRoutes,
  ...lotteryRoutes,
];
