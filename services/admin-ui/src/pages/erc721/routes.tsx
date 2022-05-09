import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Erc721Collection } from "./collection";
import { Erc721Template } from "./template";
import { Erc721Airdrop } from "./airdrop";
import { Erc721Dropbox } from "./dropbox";
import { Erc721Token } from "./token";
import { Erc721Recipes } from "./recipe";

export const erc721Routes: Array<RouteObject> = [
  {
    path: "/erc721-collections",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Collection /> },
      { path: "/erc721-collections/:id", element: <Erc721Collection /> },
    ],
  },
  {
    path: "/erc721-templates",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Template /> },
      { path: "/erc721-templates/:id", element: <Erc721Template /> },
    ],
  },
  {
    path: "/erc721-airdrops",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Airdrop /> },
      { path: "/erc721-airdrops/:id", element: <Erc721Airdrop /> },
    ],
  },
  {
    path: "/erc721-dropboxes",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Dropbox /> },
      { path: "/erc721-dropboxes/:id", element: <Erc721Dropbox /> },
    ],
  },
  {
    path: "/erc721-tokens",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Token /> },
      { path: "/erc721-tokens/:id", element: <Erc721Token /> },
    ],
  },
  {
    path: "/erc721-recipes",
    element: <Protected />,
    children: [
      { index: true, element: <Erc721Recipes /> },
      { path: "/erc721-recipes/:id", element: <Erc721Recipes /> },
    ],
  },
];
