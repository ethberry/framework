import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Airdrop } from "./airdrop";
import { Dropbox } from "./dropbox";
import { Exchange } from "./exchange";
import { Staking } from "./staking";
import { Stakes } from "./stakes";

export const mechanics: Array<RouteObject> = [
  {
    path: "/airdrop",
    element: <Protected />,
    children: [
      { index: true, element: <Airdrop /> },
      { path: "/airdrop/:id", element: <Airdrop /> },
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
    path: "/exchange",
    element: <Protected />,
    children: [
      { index: true, element: <Exchange /> },
      { path: "/exchange/:id", element: <Exchange /> },
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
    path: "/stakes",
    element: <Protected />,
    children: [
      { index: true, element: <Stakes /> },
      { path: "/stakes/:id", element: <Stakes /> },
    ],
  },
];
