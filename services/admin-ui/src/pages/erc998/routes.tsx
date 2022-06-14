import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Erc998Collection } from "./collection";
import { Erc998Template } from "./template";
import { Erc998Airdrop } from "./airdrop";
import { Erc998Dropbox } from "./dropbox";
import { Erc998Token } from "./token";
import { Erc998Recipes } from "./recipe";

export const erc998Routes: Array<RouteObject> = [
  {
    path: "/erc998-collections",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Collection /> },
      { path: "/erc998-collections/:id", element: <Erc998Collection /> },
    ],
  },
  {
    path: "/erc998-templates",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Template /> },
      { path: "/erc998-templates/:id", element: <Erc998Template /> },
    ],
  },
  {
    path: "/erc998-airdrops",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Airdrop /> },
      { path: "/erc998-airdrops/:id", element: <Erc998Airdrop /> },
    ],
  },
  {
    path: "/erc998-dropboxes",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Dropbox /> },
      { path: "/erc998-dropboxes/:id", element: <Erc998Dropbox /> },
    ],
  },
  {
    path: "/erc998-tokens",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Token /> },
      { path: "/erc998-tokens/:id", element: <Erc998Token /> },
    ],
  },
  {
    path: "/erc998-recipes",
    element: <Protected />,
    children: [
      { index: true, element: <Erc998Recipes /> },
      { path: "/erc998-recipes/:id", element: <Erc998Recipes /> },
    ],
  },
];
