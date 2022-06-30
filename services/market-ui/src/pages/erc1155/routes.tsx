import type { RouteObject } from "react-router-dom";

import { Erc1155ContractList } from "./contract-list";
import { Erc1155Contract } from "./contract";
import { Erc1155TemplateList } from "./template-list";
import { Erc1155Template } from "./template";

export const erc1155Routes: Array<RouteObject> = [
  {
    path: "/erc1155-contracts",
    children: [
      { index: true, element: <Erc1155ContractList /> },
      { path: "/erc1155-contracts/:id", element: <Erc1155Contract /> },
    ],
  },
  {
    path: "/erc1155-templates",
    children: [
      { index: true, element: <Erc1155TemplateList /> },
      { path: "/erc1155-templates/:id", element: <Erc1155Template /> },
    ],
  },
];
