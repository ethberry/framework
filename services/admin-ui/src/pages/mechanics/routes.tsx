import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Claim } from "./claim";
import { Mysterybox } from "./mysterybox";
import { Craft } from "./craft";
import { Vesting } from "./vesting";
import { Grade } from "./grade";
import { Drop } from "./drop";
import { stakingRoutes } from "./staking/routes";
import { lotteryRoutes } from "./lottery/routes";

export const mechanics: Array<RouteObject> = [
  {
    path: "/claims",
    element: <Protected />,
    children: [
      { index: true, element: <Claim /> },
      { path: "/claims/:id", element: <Claim /> },
    ],
  },
  {
    path: "/mysteryboxes",
    element: <Protected />,
    children: [
      { index: true, element: <Mysterybox /> },
      { path: "/mysteryboxes/:id", element: <Mysterybox /> },
    ],
  },
  {
    path: "/craft",
    element: <Protected />,
    children: [
      { index: true, element: <Craft /> },
      { path: "/craft/:id", element: <Craft /> },
    ],
  },
  {
    path: "/vesting",
    element: <Protected />,
    children: [
      { index: true, element: <Vesting /> },
      { path: "/vesting/:id", element: <Vesting /> },
    ],
  },
  {
    path: "/grades",
    element: <Protected />,
    children: [
      { index: true, element: <Grade /> },
      { path: "/grades/:id", element: <Grade /> },
    ],
  },
  {
    path: "/drops",
    element: <Protected />,
    children: [
      { index: true, element: <Drop /> },
      { path: "/drops/:id", element: <Drop /> },
    ],
  },
  ...stakingRoutes,
  ...lotteryRoutes,
];
