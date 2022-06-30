import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Airdrop } from "./airdrop";
import { Dropbox } from "./dropbox";
import { Exchange } from "./exchange";
import { Staking } from "./staking-rules";
import { Stakes } from "./staking-stakes";

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
    path: "/dropbox",
    element: <Protected />,
    children: [
      { index: true, element: <Dropbox /> },
      { path: "/dropbox/:id", element: <Dropbox /> },
    ],
  },
  {
    path: "/exchange-rules",
    element: <Protected />,
    children: [
      { index: true, element: <Exchange /> },
      { path: "/exchange-rules/:id", element: <Exchange /> },
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
];
