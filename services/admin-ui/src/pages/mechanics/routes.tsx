import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Airdrop } from "./airdrop";
import { Dropbox } from "./dropbox";
import { Craft } from "./craft";
import { Staking } from "./staking-rules";
import { Stakes } from "./staking-stakes";
import { Vesting } from "./vesting";

export const mechanics: Array<RouteObject> = [
  {
    path: "/airdrops",
    element: <Protected />,
    children: [
      { index: true, element: <Airdrop /> },
      { path: "/airdrops/:id", element: <Airdrop /> },
    ],
  },
  {
    path: "/dropboxes",
    element: <Protected />,
    children: [
      { index: true, element: <Dropbox /> },
      { path: "/dropboxes/:id", element: <Dropbox /> },
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
    path: "/staking-rules",
    element: <Protected />,
    children: [
      { index: true, element: <Staking /> },
      { path: "/staking-rules/:id", element: <Staking /> },
    ],
  },
  {
    path: "/staking-stakes",
    element: <Protected />,
    children: [
      { index: true, element: <Stakes /> },
      { path: "/staking-stakes/:id", element: <Stakes /> },
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
];
