import type { RouteObject } from "react-router-dom";

import { Erc1155CollectionList } from "./collection-list";
import { Erc1155Collection } from "./collection";
import { Erc1155TokenList } from "./token-list";
import { Erc1155Token } from "./token";
import { Erc1155RecipeList } from "./recipe-list";

export const erc1155Routes: Array<RouteObject> = [
  {
    path: "/erc1155-collections",
    children: [
      { index: true, element: <Erc1155CollectionList /> },
      { path: "/erc1155-collections/:id", element: <Erc1155Collection /> },
    ],
  },
  {
    path: "/erc1155-tokens",
    children: [
      { index: true, element: <Erc1155TokenList /> },
      { path: "/erc1155-tokens/:id", element: <Erc1155Token /> },
    ],
  },
  {
    path: "/erc1155-recipes",
    children: [{ index: true, element: <Erc1155RecipeList /> }],
  },
];
