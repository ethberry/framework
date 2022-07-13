import type { RouteObject } from "react-router-dom";
import { Protected } from "@gemunion/firebase-login";

import { CraftList } from "./craft";
import { Airdrop } from "./airdrop";
import { AirdropWrapper } from "./airdrop/wrapper";
import { VestingWrapper } from "./vesting/wrapper";
import { Vesting } from "./vesting";
import { Stake } from "./staking/stake";
import { Leaderboard } from "./staking/leaderboard";
import { Reward } from "./staking/reward";
import { DropboxList } from "./dropbox-list";
import { Dropbox } from "./dropbox";

export const mechanicsRoutes: Array<RouteObject> = [
  {
    path: "/airdrop",
    element: <AirdropWrapper />,
    children: [{ index: true, element: <Airdrop /> }],
  },
  {
    path: "/dropboxes",
    element: <Protected />,
    children: [
      { index: true, element: <DropboxList /> },
      { path: "/dropboxes/:id", element: <Dropbox /> },
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
