import type { RouteObject } from "react-router-dom";

import { Erc721ContractList } from "./contract-list";
import { Erc721Contract } from "./contract";
import { Erc721TemplateList } from "./template-list";
import { Erc721Template } from "./template";
import { Erc721TokenList } from "./token-list";
import { Erc721Token } from "./token";
import { Erc721Section } from "../../dashboard/hierarchy/erc721";
import { IndexWrapper } from "../../index-wrapper";

export const erc721Routes: Array<RouteObject> = [
  {
    path: "/erc721",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="erc721">
            <Erc721Section />
          </IndexWrapper>
        ),
      },
      {
        path: "/erc721/contracts",
        children: [
          { index: true, element: <Erc721ContractList /> },
          { path: "/erc721/contracts/:id", element: <Erc721Contract /> },
          { path: "/erc721/contracts/:id/:action", element: <Erc721Contract /> },
        ],
      },
      {
        path: "/erc721/templates",
        children: [
          { index: true, element: <Erc721TemplateList /> },
          { path: "/erc721/templates/:id", element: <Erc721Template /> },
          { path: "/erc721/templates/:id/:action", element: <Erc721Template /> },
        ],
      },
      {
        path: "/erc721/tokens",
        children: [
          { index: true, element: <Erc721TokenList /> },
          { path: "/erc721/tokens/:id", element: <Erc721Token /> },
          { path: "/erc721/tokens/:id/:action", element: <Erc721Token /> },
        ],
      },
    ],
  },
];
