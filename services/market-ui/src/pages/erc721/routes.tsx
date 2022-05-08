import type { RouteObject } from "react-router-dom";

import { Erc721CollectionList } from "./collection-list";
import { Erc721Collection } from "./collection";
import { Erc721DropboxList } from "./dropbox-list";
import { Erc721Dropbox } from "./dropbox";
import { Erc721TemplateList } from "./template-list";
import { Erc721Template } from "./template";
import { Erc721TokenList } from "./token-list";
import { Erc721Token } from "./token";

export const erc721Routes: Array<RouteObject> = [
  {
    path: "/erc721-collections",
    children: [
      { index: true, element: <Erc721CollectionList /> },
      { path: "/erc721-collections/:id", element: <Erc721Collection /> },
    ],
  },
  {
    path: "/erc721-dropboxes",
    children: [
      { index: true, element: <Erc721DropboxList /> },
      { path: "/erc721-dropboxes/:id", element: <Erc721Dropbox /> },
    ],
  },
  {
    path: "/erc721-templates",
    children: [
      { index: true, element: <Erc721TemplateList /> },
      { path: "/erc721-templates/:id", element: <Erc721Template /> },
    ],
  },
  {
    path: "/erc721-tokens",
    children: [
      { index: true, element: <Erc721TokenList /> },
      { path: "/erc721-tokens/:id", element: <Erc721Token /> },
    ],
  },
];
