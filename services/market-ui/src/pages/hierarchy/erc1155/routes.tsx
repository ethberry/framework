import type { RouteObject } from "react-router-dom";

import { Erc1155ContractList } from "./contract-list";
import { Erc1155Contract } from "./contract";
import { Erc1155TemplateList } from "./template-list";
import { Erc1155Template } from "./template";
import { Erc1155TokenList } from "./token-list";
import { Erc1155Token } from "./token";
import { IndexWrapper } from "../../index-wrapper";
import { Erc1155Section } from "../../dashboard/hierarchy/erc1155";

export const erc1155Routes: Array<RouteObject> = [
  {
    path: "/erc1155",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="erc1155">
            <Erc1155Section />
          </IndexWrapper>
        ),
      },
      {
        path: "/erc1155/contracts",
        children: [
          { index: true, element: <Erc1155ContractList /> },
          { path: "/erc1155/contracts/:id", element: <Erc1155Contract /> },
        ],
      },
      {
        path: "/erc1155/templates",
        children: [
          { index: true, element: <Erc1155TemplateList /> },
          { path: "/erc1155/templates/:id", element: <Erc1155Template /> },
        ],
      },
      {
        path: "/erc1155/tokens",
        children: [
          { index: true, element: <Erc1155TokenList /> },
          { path: "/erc1155/tokens/:id", element: <Erc1155Token /> },
        ],
      },
    ],
  },
];
