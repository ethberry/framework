import type { RouteObject } from "react-router-dom";

import { Erc998ContractList } from "./contract-list";
import { Erc998Contract } from "./contract";
import { Erc998TemplateList } from "./template-list";
import { Erc998Template } from "./template";
import { Erc998TokenList } from "./token-list";
import { Erc998Token } from "./token";
import { Erc998Section } from "../../dashboard/hierarchy/erc998";
import { IndexWrapper } from "../../index-wrapper";

export const erc998Routes: Array<RouteObject> = [
  {
    path: "/erc998",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="erc998">
            <Erc998Section />
          </IndexWrapper>
        ),
      },
      {
        path: "/erc998/contracts",
        children: [
          { index: true, element: <Erc998ContractList /> },
          { path: "/erc998/contracts/:id", element: <Erc998Contract /> },
        ],
      },
      {
        path: "/erc998/templates",
        children: [
          { index: true, element: <Erc998TemplateList /> },
          { path: "/erc998/templates/:id", element: <Erc998Template /> },
        ],
      },
      {
        path: "/erc998/tokens",
        children: [
          { index: true, element: <Erc998TokenList /> },
          { path: "/erc998/tokens/:id", element: <Erc998Token /> },
        ],
      },
    ],
  },
];
