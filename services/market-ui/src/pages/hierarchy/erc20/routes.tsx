import type { RouteObject } from "react-router-dom";

import { Erc20Section } from "../../dashboard/hierarchy/erc20";
import { IndexWrapper } from "../../index-wrapper";
import { Erc20TokenList } from "./token-list";
import { Erc20Token } from "./token";

export const erc20Routes: Array<RouteObject> = [
  {
    path: "/erc20",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="erc20">
            <Erc20Section />
          </IndexWrapper>
        ),
      },
      {
        path: "/erc20/tokens",
        children: [
          { index: true, element: <Erc20TokenList /> },
          { path: "/erc20/tokens/:id", element: <Erc20Token /> },
        ],
      },
    ],
  },
];
