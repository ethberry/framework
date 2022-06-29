import type { RouteObject } from "react-router-dom";

import { Erc998CollectionList } from "./contract-list";
import { Erc998Collection } from "./contract";
import { Erc998TemplateList } from "./template-list";
import { Erc998Template } from "./template";
import { Erc998TokenList } from "./token-list";
import { Erc998Token } from "./token";

export const erc998Routes: Array<RouteObject> = [
  {
    path: "/erc998-collections",
    children: [
      { index: true, element: <Erc998CollectionList /> },
      { path: "/erc998-collections/:id", element: <Erc998Collection /> },
    ],
  },
  {
    path: "/erc998-templates",
    children: [
      { index: true, element: <Erc998TemplateList /> },
      { path: "/erc998-templates/:id", element: <Erc998Template /> },
    ],
  },
  {
    path: "/erc998-tokens",
    children: [
      { index: true, element: <Erc998TokenList /> },
      { path: "/erc998-tokens/:id", element: <Erc998Token /> },
    ],
  },
];
