import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Claim } from "./claim";
import { Lootbox } from "./lootbox";
import { Craft } from "./craft";
import { Vesting } from "./vesting";
import { Grade } from "./grade";
import { stakingRoutes } from "./staking/routes";

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
    path: "/lootboxes",
    element: <Protected />,
    children: [
      { index: true, element: <Lootbox /> },
      { path: "/lootboxes/:id", element: <Lootbox /> },
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
  ...stakingRoutes,
];
